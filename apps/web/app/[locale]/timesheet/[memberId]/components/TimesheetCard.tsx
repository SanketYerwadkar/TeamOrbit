
import { formatDate } from '@/app/helpers';
import { DisplayTimeForTimesheet, TaskNameInfoDisplay, TotalDurationByDate, TotalTimeDisplay } from '@/lib/features';
import { clsxm } from '@app/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Badge } from '@components/ui/badge';
import { ArrowRightIcon } from 'assets/svg';
import { Button, Card, statusColor } from 'lib/components';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { EmployeeAvatar } from './CompactTimesheetComponent';
import { useTimesheet } from '@/app/hooks/features/useTimesheet';
import { useTimelogFilterOptions } from '@/app/hooks';
import { TimesheetLog, TimesheetStatus } from '@/app/interfaces';

interface ITimesheetCard {
    title?: string;
    date?: string
    description?: string;
    hours?: string;
    count?: number;
    color?: string;
    icon?: ReactNode;
    classNameIcon?: string
    onClick?: () => void;
}


export function TimesheetCard({ ...props }: ITimesheetCard) {
    const { icon, title, date, description, hours, count, onClick, classNameIcon } = props;
    const t = useTranslations();
    return (
        <Card
            aria-label={`Timesheet card for ${title}`}
            shadow='custom'
            className='w-full h-[175px] rounded-md border border-gray-200 dark:border-gray-600 flex  gap-8 shadow shadow-gray-100 dark:shadow-transparent p-3'>
            <div className='!gap-8 w-full space-y-4 '>
                <div className='flex flex-col gap-1 justify-start items-start'>
                    <h1 className='text-2xl md:text-[25px] font-bold truncate w-full'>{hours ?? count}</h1>
                    <h2 className='text-base md:text-[16px] font-medium text-[#282048] dark:text-gray-400 truncate w-full'>{title}</h2>
                    <span className='text-sm md:text-[14px] text-[#3D5A80] dark:text-gray-400 truncate w-full'>{date ?? description}</span>
                </div>
                <Button
                    variant='outline'
                    className={clsxm(
                        'h-9 px-3 py-2',
                        'border border-gray-200 ',
                        'text-[#282048] text-sm',
                        'flex items-center',
                        'hover:bg-gray-50 hover:dark:bg-primary-light/40 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:border-gray-600'
                    )}
                    aria-label="View timesheet details"
                    onClick={onClick}>
                    <span>{t('pages.timesheet.TIMESHEET_VIEW_DETAILS')}</span>
                    <ArrowRightIcon className={clsxm(
                        'h-6 w-6',
                        'text-[#282048] dark:text-[#6b7280]'
                    )} />
                </Button>
            </div>
            <div
                className={clsxm(
                    'h-16 w-16 rounded-lg p-5',
                    'flex items-center justify-center',
                    'text-white font-bold text-sm',
                    'shadow-lg dark:shadow-gray-800',
                    classNameIcon
                )}
                aria-hidden="true">
                {icon}
            </div>
        </Card>
    )
}



export const TimesheetCardDetail = ({ data }: { data?: Record<TimesheetStatus, TimesheetLog[]> }) => {

    const { getStatusTimesheet, groupByDate } = useTimesheet({});
    const { timesheetGroupByDays } = useTimelogFilterOptions();
    const timesheetGroupByDate = groupByDate(data?.PENDING || [])
    const t = useTranslations();
    return (
        <div className="rounded-md">
            {timesheetGroupByDate.map((plan, index) => {
                return <div key={index}>
                    <div
                        className={clsxm(
                            'h-[48px] flex justify-between items-center w-full',
                            'bg-[#ffffffcc] dark:bg-dark--theme rounded-md border-1',
                            'border-gray-400 px-5 text-[#71717A] font-medium'
                        )}>
                        <div className='flex gap-x-3'>
                            {timesheetGroupByDays === 'Weekly' && (
                                <span>Week {index + 1}</span>
                            )}
                            <span>{formatDate(plan.date)}</span>
                        </div>
                        <TotalDurationByDate
                            timesheetLog={plan.tasks}
                            createdAt={formatDate(plan.date)}
                        />
                    </div>
                    <Accordion type="single" collapsible>
                        {Object.entries(getStatusTimesheet(plan.tasks)).map(([status, rows]) => {
                            return rows.length > 0 && status && <AccordionItem
                                key={status}
                                value={status === 'DENIED' ? 'REJECTED' : status}
                                className={clsxm("p-1 rounded")}
                            >
                                <AccordionTrigger
                                    style={{ backgroundColor: statusColor(status).bgOpacity }}
                                    type="button"
                                    className={clsxm(
                                        'flex flex-row-reverse justify-end items-center w-full h-[50px] rounded-sm gap-x-2 hover:no-underline px-2',
                                        statusColor(status).text
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full space-x-1">
                                        <div className="flex items-center space-x-1">
                                            <div className={clsxm('p-2 rounded', statusColor(status).bg)}></div>
                                            <div className="flex items-center gap-x-1">
                                                <span className="text-base font-normal text-gray-400 uppercase">
                                                    {status === 'DENIED' ? 'REJECTED' : status}
                                                </span>
                                                <span className="text-gray-400 text-[14px]">({rows.length})</span>
                                            </div>
                                            <Badge
                                                variant={'outline'}
                                                className="flex items-center gap-x-2 h-[25px] rounded-md bg-[#E4E4E7] dark:bg-gray-800"
                                            >
                                                <span className="text-[#5f5f61]">{t('timer.TOTAL_HOURS')}</span>
                                                <TotalTimeDisplay timesheetLog={rows} />
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col w-full">
                                    {rows.map((task) => (
                                        <div
                                            key={task.id}
                                            style={{
                                                backgroundColor: statusColor(status).bgOpacity,
                                                borderBottomColor: statusColor(status).bg
                                            }}
                                            className={clsxm(
                                                'flex items-center border-b border-b-gray-200 dark:border-b-gray-600 space-x-4 p-1 h-[60px]'
                                            )}>
                                            <div className="flex-[2]">
                                                <TaskNameInfoDisplay
                                                    task={task.task}
                                                    className={clsxm(
                                                        'shadow-[0px_0px_15px_0px_#e2e8f0] dark:shadow-transparent'
                                                    )}
                                                    taskTitleClassName={clsxm(
                                                        'text-sm text-ellipsis overflow-hidden text-sm'
                                                    )}
                                                    showSize={false}
                                                    dash
                                                    taskNumberClassName="text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center flex-1 gap-x-2">
                                                <EmployeeAvatar
                                                    imageUrl={task.employee.user.imageUrl!}
                                                />
                                                <span className="flex-1 font-medium text-[14px] overflow-hidden">{task.employee.fullName}</span>
                                            </div>
                                            <DisplayTimeForTimesheet
                                                duration={task.timesheet.duration}
                                            />
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        })}
                    </Accordion>
                </div>
            })}
        </div>
    )
}