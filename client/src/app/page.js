"use client";

import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://ticketing.dev/api/auth/user/all");

        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
