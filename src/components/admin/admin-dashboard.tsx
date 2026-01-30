'use client';
import { useCallback, useEffect, useState } from 'react';
import { useLenis } from '@/components/common/smooth-scroll-provider';
import { getPosts, invalidatePostsCache, type Post } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import {
  FileEdit,
  LogOut,
  PlusCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormValues, PostForm } from './post-form';
import { PdfUploadForm } from './pdf-upload-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { initializeFirebase, useAuth } from '@/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';

const TableSkeleton = () => (
  <div className="rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-2/3 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-1/2 rounded-md" />
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ProgressRow = ({
  message,
  progress,
}: {
  message: string;
  progress: number;
}) => (
  <TableRow className="bg-muted/50 hover:bg-muted/50">
    <TableCell colSpan={4}>
      <div className="flex items-center gap-4 py-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="flex-grow space-y-1">
          <p className="text-sm font-medium text-foreground">{message}</p>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </TableCell>
  </TableRow>
);

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPdfFormOpen, setIsPdfFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const lenis = useLenis();
  const auth = useAuth();

  const [submissionState, setSubmissionState] = useState<{
    status: 'idle' | 'saving' | 'deleting';
    message: string;
    progress: number;
    id?: string;
  }>({ status: 'idle', message: '', progress: 0 });

  useEffect(() => {
    if (isFormOpen || isPdfFormOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [isFormOpen, isPdfFormOpen, lenis]);

  const fetchPosts = useCallback(
    async (forceRefresh = false) => {
      if (forceRefresh) invalidatePostsCache();
      setListLoading(true);
      try {
        const fetchedPosts = await getPosts(forceRefresh);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load posts',
          description: 'Could not retrieve blog posts from the database.',
        });
      } finally {
        setListLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
      // Don't show skeleton if we have cached data
      const cached = await getPosts();
      if (isMounted && cached.length > 0) {
        setPosts(cached);
        setListLoading(false);
      } else {
        setListLoading(true);
      }
      // Always fetch fresh data in the background
      await fetchPosts(true);
    };
    initialLoad();
    return () => {
      isMounted = false;
    };
  }, [fetchPosts]);

  const handleNewPost = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handlePdfSuccess = (data: { title: string; content: string }) => {
    setIsPdfFormOpen(false);
    const newPostFromPdf: Partial<Post> = {
      title: data.title,
      content: data.content,
      slug: data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-'),
      author: 'The Elysium Project',
      excerpt:
        data.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
      imageUrl: 'https://picsum.photos/seed/default/1200/800',
      imageHint: 'abstract',
    };
    setEditingPost(newPostFromPdf as Post);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsFormOpen(false);
    const isEditing = !!editingPost?.id;
    const submissionId = Math.random().toString();

    setSubmissionState({
      status: 'saving',
      message: 'Preparing...',
      progress: 0,
      id: submissionId,
    });

    try {
      const { firestore } = initializeFirebase();
      const postData = {
        ...data,
        date: serverTimestamp(),
      };

      setSubmissionState({
        status: 'saving',
        message: 'Validating data',
        progress: 33,
        id: submissionId,
      });
      await new Promise(res => setTimeout(res, 500));

      setSubmissionState({
        status: 'saving',
        message: 'Saving content',
        progress: 66,
        id: submissionId,
      });
      if (isEditing) {
        await setDoc(doc(firestore, 'blog_posts', editingPost!.id!), postData, {
          merge: true,
        });
      } else {
        await addDoc(collection(firestore, 'blog_posts'), postData);
      }

      setSubmissionState({
        status: 'saving',
        message: 'Finalizing',
        progress: 100,
        id: submissionId,
      });
      await new Promise(res => setTimeout(res, 500));

      await fetchPosts(true);

      toast({
        variant: 'success',
        title: isEditing ? 'Post Updated!' : 'Post Created!',
        description: `"${data.title}" has been saved.`,
      });
    } catch (e: any) {
      console.error('Error saving post:', e);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: e.message || 'Could not save the post to the database.',
      });
    } finally {
      setEditingPost(null);
      setSubmissionState(prev =>
        prev.id === submissionId
          ? { status: 'idle', message: '', progress: 0 }
          : prev
      );
    }
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    const submissionId = Math.random().toString();
    setSubmissionState({
      status: 'deleting',
      message: `Deleting "${postTitle}"...`,
      progress: 50,
      id: submissionId,
    });

    try {
      const { firestore } = initializeFirebase();
      await new Promise(res => setTimeout(res, 1000));
      await deleteDoc(doc(firestore, 'blog_posts', postId));

      toast({
        variant: 'success',
        title: 'Post Deleted',
        description: `"${postTitle}" has been removed.`,
      });

      await fetchPosts(true);
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description:
          error.message || 'Could not delete post from the database.',
      });
    } finally {
      setSubmissionState(prev =>
        prev.id === submissionId
          ? { status: 'idle', message: '', progress: 0 }
          : prev
      );
    }
  };

  const isOperationInProgress = submissionState.status !== 'idle';
  // Disable create if list is loading, or another operation is in progress.
  const isCreateDisabled = listLoading || isOperationInProgress;

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Admin Panel</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut(auth)}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-6">
        <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className='font-headline text-2xl font-semibold'>Blog Posts</h2>
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => setIsPdfFormOpen(true)}
                disabled={isCreateDisabled}
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" /> Create from PDF
              </Button>
              <Button onClick={handleNewPost} disabled={isCreateDisabled}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
              </Button>
            </div>
        </div>

        {listLoading ? (
          <TableSkeleton />
        ) : posts.length > 0 || isOperationInProgress ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isOperationInProgress && (
                  <ProgressRow
                    message={submissionState.message}
                    progress={submissionState.progress}
                  />
                )}
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {post.title}
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      {new Date(post.date).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPost(post)}
                        disabled={isOperationInProgress}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isOperationInProgress}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the post "
                              {post.title}
                              ". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeletePost(post.id!, post.title)
                              }
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed py-24 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              No Posts Found
            </h2>
            <p className="text-muted-foreground">
              It looks like you haven't created any posts yet.
            </p>
            <Button onClick={handleNewPost} disabled={isOperationInProgress}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Post
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setEditingPost(null);
          }
          setIsFormOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost?.id ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
            <DialogDescription>
              {editingPost?.id
                ? 'Update the details for this blog post.'
                : "Fill in the details for your new blog post. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <PostForm
            key={editingPost?.id || 'new'}
            post={editingPost}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={submissionState.status === 'saving'}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPdfFormOpen} onOpenChange={setIsPdfFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Post from PDF</DialogTitle>
            <DialogDescription>
              Upload a PDF file to automatically generate a blog post from its
              content.
            </DialogDescription>
          </DialogHeader>
          <PdfUploadForm
            onSuccess={handlePdfSuccess}
            onCancel={() => setIsPdfFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
