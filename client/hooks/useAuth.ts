import authService from "@/services/auth.service";
import { LoginDto, LogoutDto } from "@/types";
import { useMutation } from "react-query";

const useLogout = () => {
  return useMutation(({ onSuccess }: LogoutDto) => authService.logout(), {
    onSuccess: ({ data }, { onSuccess }) => {
      onSuccess();
    },
  });
};

const useLogin = () => {
  return useMutation(
    ({ username, password }: LoginDto) => authService.login(username, password),
    {
      onSuccess: ({ data }, { username, onSuccess }) => {
        onSuccess(username);
      },
    }
  );
};

export { useLogout, useLogin };
