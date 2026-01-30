'use client';
import { useEffect, useState, useCallback } from 'react';
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
import { addDoc, collection, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const lenis = useLenis();

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
    } finally {
      setListLoading(false);
    }
  }, []);

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

  const handleFormSubmit = async (data: FormValues) => {
    setIsFormOpen(false); // Close the modal immediately

    const isEditing = !!editingPost?.id;
    
    const toastController = toast({
      title: (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{isEditing ? 'Updating post...' : 'Creating post...'}</span>
        </div>
      ),
      description: `Saving "${data.title}"`,
    });
    
    const { firestore } = initializeFirebase();
    const postData = {
      ...data,
      date: isEditing && editingPost.date ? new Date(editingPost.date) : serverTimestamp(),
    };

    try {
      if (isEditing) {
        const postRef = doc(firestore, 'posts', editingPost.id!);
        await setDoc(postRef, postData, { merge: true });
      } else {
        const postsCollection = collection(firestore, 'posts');
        await addDoc(postsCollection, postData);
      }

      toastController.update({
        id: toastController.id,
        title: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>{isEditing ? 'Post Updated!' : 'Post Created!'}</span>
          </div>
        ),
        description: `"${data.title}" has been saved.`,
      });

      invalidatePostsCache();
      fetchPosts();
    } catch (e: any) {
      console.error("Error saving post:", e);
      toastController.update({
        id: toastController.id,
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <X className="h-4 w-4" />
            <span>Save failed</span>
          </div>
        ),
        description: e.message || "Could not save the post.",
      });
    }
  };


  const handleDeletePost = async (postId: string) => {
    try {
      const { firestore } = initializeFirebase();
      await deleteDoc(doc(firestore, "posts", postId));
      toast({
        title: "Post Deleted",
        description: "The blog post has been successfully removed.",
      });
      invalidatePostsCache();
      fetchPosts(); // Refresh list after deleting
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Error: Could not delete post.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-semibold">Blog Posts</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleNewPost}><PlusCircle className="mr-2 h-4 w-4" /> Create New</Button>
          <form action={logout}>
            <Button variant="outline" type="submit">Logout</Button>
          </form>
        </div>
      </div>
      
      {listLoading ? (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
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
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
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
