import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import CustomGoogleButton from '@/components/button/google-button';
import handleAxiosError from '@/helpers/handle-axios-error';
import storage from '@/helpers/storage';
import { useAuthStore } from '@/stores';

import overseaStudent from '../../assets/animations/Uy24MEqryK.json';
import BachKhoaLogo from '../../assets/bachkhoa.png';

import { WaveLeft, WaveRight, WaveRightRotated } from './wave';

export const Route = createFileRoute('/login/')({
  // beforeLoad: () => {
  //   const { isAuthenticated } = useAuthStore.getState();
  //   if (isAuthenticated) {
  //     throw redirect({
  //       to: '/',
  //     });
  //   }
  // },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setToken, setIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  void loading;
  const loginWithGoogle = async (credentialResponse: string) => {
    try {
      setLoading(true);
      // const { accessToken } = (
      //   await AuthService.loginWithGoogle(credentialResponse)
      // ).data;
      console.log('credentialResponse', credentialResponse);
      const accessToken = 'hehe123'; // temp data
      storage.setItem('token', accessToken);
      setToken(accessToken);
      setIsAuthenticated(true);
      navigate({ to: '/' });
    } catch (error: unknown) {
      handleAxiosError(error, (message: string) => {
        toast.error(message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen max-h-screen w-screen overflow-hidden bg-white">
      <img
        src={BachKhoaLogo}
        className=" absolute left-4 top-2 h-fit w-24 2xs:left-8 lg:left-12 lg:top-4 xl:left-[100px] 2xl:left-[120px]"
      />
      <div className=" m-auto flex size-full min-h-0 flex-col items-center justify-center gap-y-4 overflow-hidden 2xs:gap-y-5 md:gap-y-6 lg:gap-y-8 3xl:gap-y-12">
        <h2 className="-mb-4 text-center text-[16px] font-bold text-primary 2xs:text-[20px] md:text-[24px] xl:text-[32px] 3xl:text-[40px]">
          ĐĂNG NHẬP
        </h2>
        <div className="flex size-36 items-center justify-center rounded-full bg-primary-700 2xs:size-40 md:size-56 lg:size-72 3xl:size-[360px] 4xl:size-[400px]">
          <div className="m-auto flex size-32 items-center justify-center rounded-full bg-primary-300 2xs:size-36 md:size-[200px] lg:size-[260px] 3xl:size-[320px] 4xl:size-[360px]">
            <Lottie
              loop={true}
              animationData={overseaStudent}
              className="size-28 md:size-44 lg:size-[200px] 3xl:size-[240px] 4xl:size-[280px]"
            />
          </div>
        </div>
        <h3 className="mx-auto w-full text-center text-xs font-semibold leading-6 text-secondary md:w-full md:text-[16px] lg:max-w-96 2xl:text-[20px]">
          Tutor Support System
          <br />
          Nền tảng học tập, hỗ trợ học sinh mạnh mẽ
        </h3>
        <CustomGoogleButton
          onSuccess={async (credentialResponse) => {
            if (!credentialResponse.credential) {
              toast.error(
                'Có lỗi xảy ra khi đăng nhập bằng tài khoản Google. Vui lòng thử lại!',
              );
              return;
            }
            await loginWithGoogle(credentialResponse.credential);
          }}
          onError={() => {
            toast.error(
              'Có lỗi xảy ra khi đăng nhập bằng tài khoản Google. Vui lòng thử lại!',
            );
          }}
        />
      </div>
      <div className="bg-primary"></div>
      <div className="absolute right-0 top-0 max-h-44 w-1/2 rotate-180 xs:w-1/3 md:max-h-52 lg:hidden">
        <WaveRightRotated className="size-full" />
      </div>
      <div className="absolute bottom-0 left-0 max-h-44 w-1/2 xs:w-1/3 md:max-h-52 lg:max-h-60 lg:w-[30%] xl:max-h-64 xl:w-1/4 2xl:max-h-72 2xl:w-1/5">
        <WaveLeft className="size-full" />
      </div>
      <div className="absolute bottom-0 right-0 hidden max-h-52 w-1/3 lg:flex lg:max-h-60 lg:w-[30%] xl:max-h-64 xl:w-1/4 2xl:max-h-72 2xl:w-1/5">
        <WaveRight className="size-full" />
      </div>
    </div>
  );
}
