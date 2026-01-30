'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLenis } from '@/components/common/smooth-scroll-provider';
import { Post, invalidatePostsCache, getPosts } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { PlusCircle, Trash2, FileEdit, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostForm, type FormValues } from './post-form';
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
} from "@/components/ui/alert-dialog";
import { initializeFirebase } from '@/firebase';
import { addDoc, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

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
            <TableCell><Skeleton className="h-5 w-3/4 rounded-md" /></TableCell>
            <TableCell><Skeleton className="h-5 w-2/3 rounded-md" /></TableCell>
            <TableCell><Skeleton className="h-5 w-1/2 rounded-md" /></TableCell>
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

const ProgressRow = ({ progress, text }: { progress: number; text: string }) => (
  <TableRow className="bg-muted/50">
    <TableCell colSpan={4} className="p-0">
      <div className="flex items-center gap-4 p-4">
        <div className="w-40 text-right text-sm font-medium text-muted-foreground">{text}</div>
        <Progress value={progress} className="h-2 flex-1" />
      </div>
    </TableCell>
  </TableRow>
);

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const { toast } = useToast();
  const lenis = useLenis();

  useEffect(() => {
    if (isFormOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [isFormOpen, lenis]);

  const fetchPosts = useCallback(async () => {
    setListLoading(true);
    try {
      const fetchedPosts = await getPosts(true); // Force refresh for admin
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast({
        variant: "destructive",
        title: "Failed to load posts",
        description: "Could not retrieve blog posts from the database.",
      });
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let isMounted = true;
    const initialLoad = async () => {
        const cached = await getPosts(false);
        if (isMounted && cached.length > 0) {
            setPosts(cached);
            setListLoading(false);
            const freshPosts = await getPosts(true);
            if (isMounted) {
                setPosts(freshPosts);
            }
        } else {
            await fetchPosts();
        }
    };
    initialLoad();
    return () => {
        isMounted = false;
    }
  }, [fetchPosts]);

  const handleNewPost = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsFormOpen(false);
    setIsSaving(true);
    const isEditing = !!editingPost?.id;
    const { firestore } = initializeFirebase();

    try {
      // --- Stage 1: Validation ---
      setProgressText('Validating data...');
      setProgress(25);
      await new Promise(res => setTimeout(res, 400));

      // --- Stage 2: Saving ---
      setProgressText('Saving content...');
      setProgress(60);
      const postData = {
        ...data,
        date: new Date().toISOString(),
      };
      
      if (isEditing) {
        await setDoc(doc(firestore, 'posts', editingPost!.id!), postData, { merge: true });
      } else {
        await addDoc(collection(firestore, 'posts'), postData);
      }

      // --- Stage 3: Finalizing ---
      setProgressText('Finalizing...');
      setProgress(90);
      invalidatePostsCache();
      await fetchPosts();

      // --- Complete ---
      setProgress(100);
      await new Promise(res => setTimeout(res, 500)); // Let user see 100%

      toast({
        title: <div className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /><span>{isEditing ? 'Post Updated!' : 'Post Created!'}</span></div>,
        description: `"${data.title}" has been saved.`,
      });
    } catch (e: any) {
      console.error("Error saving post:", e);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e.message || "Could not save the post to the database.",
      });
    } finally {
      setIsSaving(false);
      setEditingPost(null);
    }
  };

  const handleDeletePost = async (postId: string, postTitle: string) => {
    setIsSaving(true);
    try {
      setProgressText('Deleting post...');
      setProgress(50);
      
      const { firestore } = initializeFirebase();
      await deleteDoc(doc(firestore, "posts", postId));
      
      setProgress(100);
      await new Promise(res => setTimeout(res, 500));

      toast({
        title: "Post Deleted",
        description: `"${postTitle}" has been removed.`,
      });

      invalidatePostsCache();
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete post from the database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-semibold">Blog Posts</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleNewPost} disabled={isSaving || listLoading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New
          </Button>
          <form action={logout}>
            <Button variant="outline" type="submit" disabled={isSaving}>Logout</Button>
          </form>
        </div>
      </div>
      
      {listLoading && !isSaving ? (
        <TableSkeleton />
      ) : (
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
              {isSaving && <ProgressRow progress={progress} text={progressText} />}
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)} disabled={isSaving}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isSaving}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the post "{post.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePost(post.id!, post.title)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingPost(null);
        }
        setIsFormOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] pr-6 -mr-6">
            <PostForm
              key={editingPost?.id || 'new'}
              post={editingPost}
              onSubmit={handleFormSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
