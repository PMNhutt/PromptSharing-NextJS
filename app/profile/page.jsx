"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        })

        const filteredPrompt = posts.filter((p) => p._id !== post._id)
        setPosts(filteredPrompt)
      } catch (error) {
        console.log(error)
      }
    }
  };

  // ** get data
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await res.json();
      setPosts(data);
    };

    if (session?.user.id) {
      fetchPosts();
    }
  }, []);

  return (
    <Profile
      name="My"
      desc="Welcome to your personal profile"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;