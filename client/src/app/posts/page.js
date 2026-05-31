import React from "react";

const PostPage = async () => {
  try {
    const response = await fetch("http://ticketing.dev/api/auth/user/all", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return <div>Post Page</div>;
};

export default PostPage;
