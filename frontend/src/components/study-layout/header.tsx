import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  Next,
  ProfileIcon,
  SidebarToggleIcon,
  SignOut,
} from '@/components/icons';
// import vndFormat from '@/helpers/currency-format';
import handleAxiosError from '@/helpers/handle-axios-error';
import { useAuthStore } from '@/stores';
// import { useUserStore } from '@/stores';
import { User } from '@/types';
import storage from '@/utils/storage';

type HeaderProps = {
  user: User | null;
  setUser: (user: User | null) => void;
  toggleSidebarMobile: () => void;
  toggleSidebarDesktop: () => void;
};

const Header = ({
  user,
  setUser,
  toggleSidebarDesktop,
  toggleSidebarMobile,
}: HeaderProps) => {
  const { logout: authLogout, isAuthenticated } = useAuthStore();

  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setLoading(true);
      // await AuthService.logout();
      
      // Use store's logout to clear auth state
      authLogout();
      
      // Clear any legacy token storage
      storage.removeItem('token');
      
      // Clear user state
      setUser(null);
      
      navigate({ to: '/login' });
    } catch (error: unknown) {
      handleAxiosError(error, (message: string) => {
        toast.error(message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="study-layout-header"
      className="sticky top-0 z-[98] flex h-20 w-full flex-row items-center border-b border-solid border-tertiary-300 bg-white p-5 3xl:h-24 3xl:px-10"
    >
      <SidebarToggleIcon
        onClick={toggleSidebarMobile}
        className="relative flex size-8 cursor-pointer fill-tertiary xl:hidden"
      />
      <SidebarToggleIcon
        onClick={toggleSidebarDesktop}
        className="relative hidden size-8 cursor-pointer fill-tertiary xl:flex"
      />
      <div className="flex flex-1" />
      {isAuthenticated ? (
        <>
          <div
            className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border-[0.5px] border-solid border-tertiary p-1 xl:h-12 xl:w-80 xl:justify-between"
            onClick={() => setDropdownOpened(!dropdownOpened)}
          >
            <div className="flex h-full flex-row items-center gap-2">
              <div
                style={{ backgroundImage: `url(${user?.picture})` }}
                className={`${user?.picture ? '' : 'flex items-center justify-center bg-tertiary'} relative size-8 rounded-full bg-cover xl:size-10`}
              >
                {user?.picture ? (
                  <></>
                ) : (
                  <ProfileIcon className="size-5 fill-white" />
                )}
              </div>
              <div className="relative hidden flex-col justify-center py-2 xl:flex">
                <span className="select-none text-[14px] font-bold">
                  {user?.firstName || user?.lastName
                    ? `${user?.lastName} ${user?.firstName}`
                    : '[TÊN CHƯA CẬP NHẬT]'}
                </span>
                <span className="select-none text-[12px] text-tertiary-300">
                  {user?.email}
                </span>
              </div>
            </div>
            <Next
              className={`${dropdownOpened ? 'rotate-180' : ''} mr-4 hidden size-4 fill-tertiary xl:flex`}
            />
          </div>
          <div
            className={`${dropdownOpened ? 'flex' : 'hidden'} absolute right-5 top-[4.5rem] z-[99] h-28 w-40 flex-col rounded-lg bg-white shadow-[0_8px_16px_0_rgba(0,0,0,0.25)] xl:w-80`}
          >
            <Link
              to="/dashboard"
              className="relative flex h-14 w-full flex-row items-center gap-2 rounded-lg px-2 duration-200 ease-in-out hover:bg-tertiary-300"
            >
              <ProfileIcon className="relative size-6 fill-tertiary" />
              <span className="select-none">Hồ sơ cá nhân</span>
            </Link>
            <div
              onClick={async () => {
                if (loading) return;
                await logout();
              }}
              className="relative flex h-14 w-full cursor-pointer flex-row items-center gap-2 rounded-lg px-2 text-red-600 duration-200 ease-in-out hover:bg-red-300"
            >
              <SignOut className="relative size-6" />
              <span className="select-none">Đăng xuất</span>
            </div>
          </div>
        </>
      ) : (
        <Link
          to="/login"
          className="relative flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xl font-bold text-white duration-200 ease-in-out hover:bg-primary-700 md:px-6 3xl:px-8 3xl:text-2xl"
        >
          {' '}
          Đăng nhập
        </Link>
      )}
    </div>
  );
};

export default Header;
