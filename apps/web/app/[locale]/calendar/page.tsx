'use client';

import {
  useLocalStorageState,
  useModal,
  useOrganizationTeams
} from '@app/hooks';
import { fullWidthState } from '@app/stores/fullWidth';
import { clsxm } from '@app/utils';
import HeaderTabs from '@components/pages/main/header-tabs';
import { PeoplesIcon } from 'assets/svg';
import { withAuthentication } from 'lib/app/authenticator';
import { Breadcrumb, Container, Divider } from 'lib/components';
import { SetupFullCalendar } from 'lib/features';
import { Footer, MainLayout } from 'lib/layout';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { HeadCalendar } from './component';
import { AddManualTimeModal } from 'lib/features/manual-time/add-manual-time-modal';
import {
  SetupTimeSheet,
  timesheetCalendar
} from 'lib/features/integrations/calendar';

const CalendarPage = () => {
  const t = useTranslations();
  const fullWidth = useAtomValue(fullWidthState);
  const { activeTeam, isTrackingEnabled } = useOrganizationTeams();
  const [calendarTimeSheet, setCalendarTimeSheet] = useLocalStorageState<
    timesheetCalendar
  >('calendar-timesheet', 'Calendar');
  const {
    isOpen: isManualTimeModalOpen,
    openModal: openManualTimeModal,
    closeModal: closeManualTimeModal
  } = useModal();

  const params = useParams<{ locale: string }>();
  const currentLocale = params ? params.locale : null;
  const breadcrumbPath = useMemo(
    () => [
      { title: JSON.parse(t('pages.home.BREADCRUMB')), href: '/' },
      { title: activeTeam?.name || '', href: '/' },
      { title: 'CALENDAR', href: `/${currentLocale}/calendar` }
    ],
    [activeTeam?.name, currentLocale, t]
  );

  const renderComponent = () => {
    switch (calendarTimeSheet) {
      case 'Calendar':
        return <SetupFullCalendar />;
      case 'TimeSheet':
        return <SetupTimeSheet timesheet={calendarTimeSheet} />;
      default:
        return null;
    }
  };
  return (
    <>
      <MainLayout
        showTimer={isTrackingEnabled}
        footerClassName="hidden"
        className="h-full shadow-xl"
      >
        <AddManualTimeModal
          closeModal={closeManualTimeModal}
          isOpen={isManualTimeModalOpen}
          params="AddManuelTime"
          timeSheetStatus="ManagerTimesheet"
        />
        <div className="fixed top-20 flex flex-col border-b-[1px] dark:border-gray-800 z-10 mx-0 w-full bg-white dark:bg-dark-high shadow-lg shadow-gray-100 dark:shadow-gray-700 ">
          <Container fullWidth={fullWidth}>
            <div className="flex flex-row items-start justify-between mt-12 bg-white dark:bg-dark-high">
              <div className="flex items-center justify-center h-10 gap-8">
                <PeoplesIcon className="text-dark dark:text-[#6b7280] h-6 w-6" />
                <Breadcrumb paths={breadcrumbPath} className="text-sm" />
              </div>
              <div className="flex items-center justify-center h-10 gap-1 w-max">
                <HeaderTabs kanban={true} linkAll={true} />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <HeadCalendar
                openModal={openManualTimeModal}
                timesheet={calendarTimeSheet}
                setCalendarTimeSheet={setCalendarTimeSheet}
              />
              <div className="w-full border border-gray-100 dark:border-gray-800"></div>
            </div>
          </Container>
        </div>
        <div className="mt-[15vh] mb-32">
          <Container fullWidth={fullWidth}>{renderComponent()}</Container>
        </div>
      </MainLayout>
      <div className="bg-white dark:bg-[#1e2025] w-screen z-[5000] fixed bottom-0">
        <Divider />
        <Footer
          className={clsxm(
            'justify-between w-full px-0 mx-auto',
            fullWidth ? 'px-8' : 'x-container'
          )}
        />
      </div>
    </>
  );
};

export default withAuthentication(CalendarPage, { displayName: 'Calendar' });