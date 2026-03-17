import { ErrorPage, IconError } from "@/atoms";
import { Icons } from "@/assets";

const { keyIcon, lockIcon, searchIcon, warningIcon } = Icons;

export const TestErrorPage = () => {
  const navigateHome = () => alert("Navigating to Home Page...");
  const navigateDashboard = () => alert("Navigating to Dashboard...");

  return (
    <div style={{ display: "grid", gap: "3rem" }}>
      {/* Example 1: Default 404 page */}
      <ErrorPage handleNavigate={navigateHome} />

      {/* Example 2: 500 Server Error with custom message */}
      <ErrorPage
        statusCode={500}
        ErrorMsg="server error"
        statusDetail="Database connection failed"
        responseCode="DB1001"
        handleNavigate={navigateHome}
        navigateTo="Home Page"
      />

      {/* Example 3: 401 Unauthorized */}
      <ErrorPage
        statusCode={401}
        ErrorMsg="unauthorized access"
        handleNavigate={navigateDashboard}
        navigateTo="Dashboard"
      />

      {/* Example 4: 403 Access Denied */}
      <ErrorPage
        statusCode={403}
        ErrorMsg="access denied"
        statusDetail="You do not have permission to view this page"
        handleNavigate={navigateHome}
      />

      {/* Example 5: 404 Page Not Found with response code */}
      <ErrorPage
        statusCode={404}
        ErrorMsg="page not found"
        responseCode="NF404"
        handleNavigate={navigateHome}
      />

      {/* Example 6: Custom status code 502 */}
      <ErrorPage
        statusCode={502}
        ErrorMsg="bad gateway"
        statusDetail="The server received an invalid response from upstream"
        handleNavigate={navigateDashboard}
        navigateTo="Dashboard"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        {/* Example 1: Default warning icon */}
        <IconError icon={warningIcon} message="Something went wrong!" />

        {/* Example 2: Key icon, larger size */}
        <IconError icon={keyIcon} message="Unauthorized access" size={3} />

        {/* Example 3: Lock icon with fixed container size */}
        <IconError
          icon={lockIcon}
          message="Access denied"
          height="150px"
          width="150px"
        />

        {/* Example 4: Search icon with custom container and icon size */}
        <IconError
          icon={searchIcon}
          message="Page not found"
          height="120px"
          width="120px"
          size={2.5}
        />
      </div>
    </div>
  );
};
