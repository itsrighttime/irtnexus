import { useEffect, useState } from "react";
import { apiCaller } from "#utils";
import { sidebarConfig } from "#services";

export const useSidebar = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // const response = await apiCaller({ endpoint });
        const response = { success: true, data: sidebarConfig }; // Mock response for testing

        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
};
