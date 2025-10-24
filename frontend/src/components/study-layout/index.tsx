import { ReactNode, useState } from 'react';

import { useUserStore } from '@/stores';

// import CountdownBar from '../countdown-bar';

import Header from './header';
import SidebarDesktop from './sidebar-desktop';
import SidebarMobile from './sidebar-mobile';

type StudyLayoutProps = {
  children: ReactNode;
};

const StudyLayout = ({ children }: StudyLayoutProps) => {
  const { user, setUser } = useUserStore();
  const [sidebarMobileOpened, setSidebarMobileOpened] = useState(false);
  const [sidebarDesktopOpened, setSidebarDesktopOpened] = useState(true);

  return (
    <div className="relative flex h-fit min-h-screen w-screen min-w-[360px] flex-row bg-white">
      <SidebarMobile
        isManager={user?.isManager}
        opened={sidebarMobileOpened}
        close={() => setSidebarMobileOpened(false)}
      />
      <SidebarDesktop
        isManager={user?.isManager}
        opened={sidebarDesktopOpened}
      />
      <div className="relative flex h-fit w-full min-w-0 flex-col bg-white">
        <Header
          user={user}
          setUser={setUser}
          toggleSidebarMobile={() =>
            setSidebarMobileOpened(!sidebarMobileOpened)
          }
          toggleSidebarDesktop={() =>
            setSidebarDesktopOpened(!sidebarDesktopOpened)
          }
        />
        {/* <CountdownBar /> */}
        <div className="relative flex flex-col p-5 3xl:p-10">{children}</div>
      </div>
    </div>
  );
};

export default StudyLayout;
