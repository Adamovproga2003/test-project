import axios from "axios";
import { useEffect, useState } from "react";

type ResponseMeDto = {
  msg: string;
  user: {
    _id: number;
    username: string;
  };
};

const useAuthCheck = (token: string | null) => {
  const [isAuth, setAuth] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      setLoading(true);
    };
    auth();
  }, []);

  return { isAuth, username, isLoading };
};

export default useAuthCheck;
