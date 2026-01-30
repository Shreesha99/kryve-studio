'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLenis } from '@/components/common/smooth-scroll-provider';
import { Post, invalidatePostsCache, getPosts } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { Loader2, PlusCircle, Trash2, FileEdit, Check, X } from 'lucide-react';
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
import { gsap } from 'gsap';

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTl = useRef<gsap.core.Timeline | null>(null);

  const lenis = useLenis();

  // Animate progress bar
  useEffect(() => {
    if (isSaving) {
      progressTl.current?.kill(); // Kill any existing animation
      progressTl.current = gsap.timeline();
      progressTl.current.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 0.9,
          duration: 8, // Simulate a longer process
          ease: 'power1.out',
        }
      );
    }
  }, [isSaving]);

  // Effect to control body scroll when modal is open
  useEffect(() => {
    if (isFormOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    // Cleanup on component unmount
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isFormOpen, lenis]);

  const fetchPosts = useCallback(async () => {
    setListLoading(true);
    try {
      const fetchedPosts = await getPosts(true); // forceRefresh = true
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
    fetchPosts();
  }, [fetchPosts]);
  
  const handleNewPost = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };
  
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const completeSaveAnimation = (callback?: () => void) => {
    if (progressTl.current) {
        progressTl.current.to(progressRef.current, {
            scaleX: 1,
            duration: 0.4,
            ease: 'power1.in',
            onComplete: () => {
                setIsSaving(false);
                if (callback) callback();
            }
        });
    } else {
        setIsSaving(false);
        if (callback) callback();
    }
  }

  const handleFormSubmit = (data: FormValues) => {
    setIsFormOpen(false);
    setIsSaving(true);
    
    const isEditing = !!editingPost?.id;
    
    const { firestore } = initializeFirebase();
    const postData = {
      ...data,
      date: new Date(),
    };

    const writePromise = isEditing
      ? setDoc(doc(firestore, 'posts', editingPost!.id!), postData, { merge: true })
      : addDoc(collection(firestore, 'posts'), postData);

    writePromise
      .then(() => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{isEditing ? 'Post Updated!' : 'Post Created!'}</span>
            </div>
          ),
          description: `"${data.title}" has been saved.`,
        });
        invalidatePostsCache();
        completeSaveAnimation(() => fetchPosts());
      })
      .catch((e: any) => {
        console.error("Error saving post:", e);
        toast({
          variant: "destructive",
          title: "Save failed",
          description: e.message || "Could not save the post.",
        });
        completeSaveAnimation();
      });
  };


  const handleDeletePost = async (postId: string) => {
    setIsSaving(true);
    try {
      const { firestore } = initializeFirebase();
      await deleteDoc(doc(firestore, "posts", postId));
      toast({
        title: "Post Deleted",
        description: "The blog post has been successfully removed.",
      });
      invalidatePostsCache();
      completeSaveAnimation(() => fetchPosts());
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Error: Could not delete post.",
      });
      completeSaveAnimation();
    }
  };

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

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-semibold">Blog Posts</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleNewPost} disabled={isSaving}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New
          </Button>
          <form action={logout}>
            <Button variant="outline" type="submit" disabled={isSaving}>Logout</Button>
          </form>
        </div>
      </div>
      
      {listLoading ? (
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
              {isSaving && (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <div className="relative h-1 w-full overflow-hidden">
                      <div
                        ref={progressRef}
                        className="h-full origin-left bg-primary"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleString()}</TableCell>
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
                          <AlertDialogAction onClick={() => handleDeletePost(post.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto -mr-6 pr-6">
            <PostForm
              key={editingPost?.id || 'new-post'}
              post={editingPost}
              onSubmit={handleFormSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
