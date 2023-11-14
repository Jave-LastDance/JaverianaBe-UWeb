import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export function useGetUsers() {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.users || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users.length,
    }),
    [data?.users, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------



export function useGetUser(userId) {
  const URL = `${HOST_API}${endpoints.user.details}?userId=${userId}`;

  const { data, error } = useSWR(userId ? URL : null, fetcher);

  const userLoading = !data && !error;
  const userError = error;
  const userValidating = !data && !error;

  const memoizedValue = useMemo(
    () => ({
      userWeb: data,
      userLoading,
      userError,
      userValidating,
    }),
    [data, userLoading, userError, userValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateUser(userData, userId) {
  const URL = `${HOST_API}${endpoints.user.update}?userId=${userId}`;

  await axios
    .put(URL, userData )
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}
// ----------------------------------------------------------------------

export async function createUser(userData) {

  console.log('userData', userData);
  const URL = `${HOST_API}${endpoints.user.create}`;

  await axios
    .post(URL,  userData)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}


export async function deleteUser(userId) {
  const URL = `${HOST_API}${endpoints.user.delete}?userId=${userId}`;

  await axios
    .delete(URL, { userId })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}