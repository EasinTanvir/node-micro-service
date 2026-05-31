import axios from "axios";

export const dynamic = "force-dynamic";

const PostPage = async () => {
  try {
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/auth/user/all",
      {
        headers: {
          Host: "ticketing.dev",
        },
      },
    );

    console.log("all users", response.data);
  } catch (error) {
    console.error(error);
  }

  console.log("hello bro");

  return <div>Post</div>;
};

export default PostPage;
