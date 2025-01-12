import React, { useEffect, useState } from "react";

function UserInfo() {
  const [userName, setUserName] = useState({ firstName: "", lastName: "" }); // State to store the user's full name

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/authent/users/");
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log the entire data to check its structure

          // Check if the data is an array and use the first user if available
          if (Array.isArray(data) && data.length > 0) {
            setUserName({
              firstName: data[0].first_name || "User",
              lastName: data[0].last_name || "",
            });
          } else {
            setUserName({ firstName: "User", lastName: "" }); // Fallback if no users are found
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="d-flex align-items-center">
      <span>
        Hello, {userName.firstName} {userName.lastName}
      </span>
    </div>
  );
}

export default UserInfo;
