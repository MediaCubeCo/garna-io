import React, { useEffect, useState, useRef } from 'react';
import styles from './modal.module.css';
import Button from '../button/button';
import Form from '../form/form';
import { useForm } from '../../hooks/useForm';
import formValidation from '../../utils/validtionForm';
import { getCalApi } from '@calcom/embed-react';
import { sendGtagEvent } from '../../utils/gtag';
import { hashEmail } from '../../utils/hashEmail';
import { sendFormCompletedWebhook } from '../../utils/webhook';

export interface IForm {
	firstName: string;
	lastName: string;
	email: string;
	numEmployes: string;
}
export type IFormErrors = Record<keyof IForm, string>;
export interface IValidInfo {
	isFormValid: boolean;
	errorsMessage: IFormErrors;
}

/** Optional widget copy; when provided, overrides default English strings. */
export interface IModalTranslations {
	buttonChooseDate?: string;
	signUpPromptPrefix?: string;
	signUpLinkText?: string;
	signUpPromptSuffix?: string;
	disclaimerPrefix?: string;
	privacyLinkText?: string;
	disclaimerSuffix?: string;
	form?: {
		firstName?: string;
		lastName?: string;
		email?: string;
		employees?: string;
	};
	companySizeOptions?: string[];
	errors?: {
		required?: string;
		invalidEmail?: string;
		workEmail?: string;
		invalidPhone?: string;
	};
}

export interface IModalProps {
	calComLink: string;
	titleButton: string;
	titleButtonForm: string;
	title: string;
	subtitle: string;
	colorBrandBg: string;
	colorBrandText: string;
	bgColorCal: string;
	colorBorder: string;
	thicknessBorder: string;
	radiusBorder: string;
	colorTextMain: string;
	colorTextCalendar: string;
	colorTextError: string;
	colorBorderTimeCalendar: string;
	colorBorderVerticalLine: string;
	colorTextLogo: string;
	/** Current language/locale for sign-up and privacy links (e.g. 'en', 'es'). Defaults to 'en'. */
	locale?: string;
	/** Optional translations for all widget copy; keys match page bookingWidget. */
	translations?: IModalTranslations;
	// Optional props for external control
	isModalVis?: boolean;
	onCloseModal?: () => void;
}
const DEFAULT_TRANSLATIONS: Required<IModalTranslations> = {
	buttonChooseDate: 'Choose a date & time',
	signUpPromptPrefix: 'Contractor or employee? ',
	signUpLinkText: 'Sign up',
	signUpPromptSuffix: ' here instead',
	disclaimerPrefix:
		'We respect your data. By submitting this form, you agree that we will contact you in relation to our products and services, in accordance with our ',
	privacyLinkText: 'privacy policy',
	disclaimerSuffix: '.',
	form: {
		firstName: 'First name*',
		lastName: 'Last name*',
		email: 'Work email*',
		employees: 'Number of employees*',
	},
	companySizeOptions: ['1-20 people', '21-200 people', '201-1000 people', '1001-2000 people', '2001+ people'],
	errors: {
		required: 'This field is required',
		invalidEmail: 'Please enter a valid email address',
		workEmail: 'Please use your work email (no free email providers like Gmail, Yahoo, etc.)',
		invalidPhone: 'Please enter a valid phone number',
	},
};

export default function Modal({
	calComLink = 'garna/demo',
	titleButton = 'Book a Demo',
	titleButtonForm = 'Continue',
	title = 'Title insert here',
	subtitle = 'Subtitle insert here',
	bgColorCal = '#0a0a0a',
	colorBrandBg = '#5ea500',
	colorBrandText = '#ffffffff',
	colorBorder = 'rgb(34, 34, 34)',
	thicknessBorder = '1px',
	radiusBorder = '32px',
	colorTextMain = '#ffffffff',
	colorTextCalendar = '#a4a4a4ff',
	colorTextError = 'pink',
	colorBorderTimeCalendar = '#ffffff9a',
	colorBorderVerticalLine = 'rgb(34, 34, 34)',
	colorTextLogo = '#5d5d5dff',
	locale = 'en',
	translations: translationsOverride,
	isModalVis: externalIsModalVis,
	onCloseModal: externalOnCloseModal,
}: IModalProps): React.JSX.Element {
	const t = { ...DEFAULT_TRANSLATIONS, ...translationsOverride };
	const formLabels = { ...DEFAULT_TRANSLATIONS.form, ...translationsOverride?.form };
	const errorMessages = { ...DEFAULT_TRANSLATIONS.errors, ...translationsOverride?.errors };
	const companySizeOptions = (
		translationsOverride?.companySizeOptions?.length
			? translationsOverride.companySizeOptions
			: DEFAULT_TRANSLATIONS.companySizeOptions
	) as string[];
	const signUpUrl = `https://app.garna.io/${locale}/auth/sign-up`;
	const privacyUrl = `https://app.garna.io/api/privacy?lang=${locale}`;
	// Use external state if provided, otherwise use internal state
	const [internalIsModalVis, setIsModalVisible] = useState(false);
	const isModalVis = externalIsModalVis !== undefined ? externalIsModalVis : internalIsModalVis;

	const onToogleModal = () => {
		if (externalOnCloseModal) {
			externalOnCloseModal();
		} else {
			setIsModalVisible(!internalIsModalVis);
		}
	};

	const [validInfo, setValidInfo] = useState({
		isFormValid: false,
		errorsMessage: {
			firstName: '',
			lastName: '',
			email: '',
			numEmployes: '',
		},
	});

	const { values, handleChange } = useForm<IForm>({
		firstName: '',
		lastName: '',
		email: '',
		numEmployes: '',
	});
	//Контейнр для встраивания calCom
	const calContainerRef = useRef<HTMLDivElement | null>(null);
	const webhookSentRef = useRef(false);

	const onCloseModal = () => {
		if (externalOnCloseModal) {
			externalOnCloseModal();
		} else {
			setIsModalVisible(false);
		}

		//Сброс шага обратно на форму
		setValidInfo((prev) => ({ ...prev, isFormValid: false }));
		webhookSentRef.current = false;
		if (calContainerRef.current) {
			calContainerRef.current.innerHTML = '';
		}
	};

	// Send webhook + gtag when user completes the form and moves to step 2 (calendar)
	useEffect(() => {
		if (!validInfo.isFormValid || webhookSentRef.current) return;
		webhookSentRef.current = true;

		(async () => {
			const garnaClientID = await hashEmail(values.email);
			sendFormCompletedWebhook({ ...values, garnaClientID });
			sendGtagEvent('form_step1_completed', {
				first_name: values.firstName,
				last_name: values.lastName,
				num_employees: values.numEmployes,
				garna_client_id: garnaClientID,
			});
		})();
	}, [validInfo.isFormValid, values.firstName, values.lastName, values.email, values.numEmployes]);

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isModalVis) {
			const prevOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = prevOverflow;
			};
		}
	}, [isModalVis]);

	useEffect(() => {
		const closeModal = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onCloseModal();
			}
		};
		document.addEventListener('keydown', closeModal);
		return () => document.removeEventListener('keydown', closeModal);
	}, [onCloseModal]);

	//Инициализация CalCom после успешной валидации формы
	useEffect(() => {
		if (!isModalVis) return;
		if (!validInfo.isFormValid) return;

		const container = calContainerRef.current;
		if (!container) return;

		let cancelled = false;
		const namespace = calComLink.replace('/', '-');

		(async () => {
			const cal = await getCalApi({ namespace: namespace });
			if (cancelled) return;

			// Inline embed + prefill. Steps 2 & 3 (calendar, booking) stay in Cal.com default language.
			const fullName = [values.firstName, values.lastName].filter(Boolean).join(' ').trim();
			cal('inline', {
				elementOrSelector: container,
				calLink: calComLink,
				config: {
					layout: 'month_view',
					theme: 'dark',
					name: fullName,
					email: values.email,
				},
			});
			// 🔽 UI и стилизация под garna.io
			cal('ui', {
				theme: 'dark',
				cssVarsPerTheme: {
					light: { 'cal-brand': '#5ea500' },
					dark: {
						'cal-brand': colorBrandBg,
						'cal-brand-text': colorBrandText,
						'cal-bg-muted': bgColorCal,
						'cal-border-booker': colorBorder, //Бордер обводка
						'cal-border-booker-width': thicknessBorder, //толщина обводки
						'cal-radius': radiusBorder, //радиус обводки

						'cal-text': colorTextMain, // основной цвет текста
						'cal-text-emphasis': colorTextCalendar, //Цвет шрифта календаря
						'cal-text-error': colorTextError, //Цвет ошибки
						'cal-border': colorBorderTimeCalendar, //обводка Времени
						'cal-border-subtle': colorBorderVerticalLine, //Цвет разделительных линий
						'cal-bg-emphasis': colorTextLogo, //Цвет текста логотипа
					},
				},
				layout: 'month_view',
			});

			// Cal.com embed events → gtag (GA4) when booking/reschedule/cancel completes
			const toBookingParams = (data: Record<string, unknown>) => ({
				booking_uid: data?.uid,
				booking_title: data?.title,
				start_time: data?.startTime,
				end_time: data?.endTime,
				event_type_id: data?.eventTypeId,
				status: data?.status,
				payment_required: data?.paymentRequired,
				is_recurring: data?.isRecurring,
				all_bookings: data?.allBookings,
				video_call_url: data?.videoCallUrl,
				cal_link: calComLink,
			});

			const sendBookingGtagWithApplicant = (
				eventName: string,
				calData: Record<string, unknown>
			) => {
				hashEmail(values.email).then((applicantGarnaClientID) => {
					sendGtagEvent(eventName, {
						...toBookingParams(calData),
						applicant_first_name: values.firstName,
						applicant_last_name: values.lastName,
						applicant_garna_client_id: applicantGarnaClientID,
					});
				});
			};

			cal('on', {
				action: 'bookingSuccessfulV2',
				callback: (e: { detail: { data?: Record<string, unknown> } }) => {
					sendBookingGtagWithApplicant('cal_booking_success', e.detail?.data ?? {});
				},
			});
			cal('on', {
				action: 'rescheduleBookingSuccessfulV2',
				callback: (e: { detail: { data?: Record<string, unknown> } }) => {
					sendBookingGtagWithApplicant('cal_reschedule_success', e.detail?.data ?? {});
				},
			});
			cal('on', {
				action: 'bookingCancelled',
				callback: (e: { detail: { data?: Record<string, unknown> } }) => {
					const data = e.detail?.data ?? {};
					const booking = (data.booking as Record<string, unknown>) ?? {};
					const organizer = (data.organizer as Record<string, unknown>) ?? {};
					const eventType = (data.eventType as Record<string, unknown>) ?? {};
					sendGtagEvent('cal_booking_cancelled', {
						cancellation_reason: booking?.cancellationReason,
						organizer_name: organizer?.name,
						organizer_email: organizer?.email,
						event_type_title: eventType?.title,
						cal_link: calComLink,
					});
				},
			});
		})();

		return () => {
			cancelled = true;
		};
	}, [
		isModalVis,
		validInfo.isFormValid,
		values.firstName,
		values.lastName,
		values.email,
		calComLink,
		colorBrandBg,
		colorBrandText,
		bgColorCal,
		colorBorder,
		thicknessBorder,
		radiusBorder,
		colorTextMain,
		colorTextCalendar,
		colorTextError,
		colorBorderTimeCalendar,
		colorBorderVerticalLine,
		colorTextLogo,
	]);

	const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onCloseModal();
		}
	};

	return (
		<div className="garna-demo-component">
			{/* Button removed - external buttons will trigger the widget */}
			<div className={styles.garna_demo_modal_overlay} hidden={!isModalVis} onMouseDown={handleOverlayMouseDown}>
				<div
					className={!validInfo.isFormValid ? styles.garna_garna_demo_modal : styles.garna_garna_demo_modal_step_2}
					onMouseDown={(e) => e.stopPropagation()}
				>
					<div className={styles.btn_wrap}>
						<button className={styles.garna_demo_modal_close} onClick={onToogleModal}>
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M5.18164 5.18164C5.53314 4.83047 6.10371 4.83027 6.45508 5.18164L16 14.7266L25.5459 5.18164C25.8973 4.83077 26.467 4.83061 26.8184 5.18164C27.1697 5.53301 27.1695 6.10358 26.8184 6.45508L17.2725 16L26.8184 25.5459C27.1697 25.8973 27.1695 26.4669 26.8184 26.8184C26.4669 27.1698 25.8974 27.1698 25.5459 26.8184L16 17.2725L6.45508 26.8184C6.10361 27.1698 5.53311 27.1698 5.18164 26.8184C4.83051 26.4669 4.83047 25.8973 5.18164 25.5459L14.7266 16L5.18164 6.45508C4.83017 6.10361 4.83017 5.53311 5.18164 5.18164Z"
									fill="white"
								/>
							</svg>
						</button>
					</div>

					<div className={styles.garna_demo_form_wrapper} hidden={validInfo.isFormValid}>
						<div className={styles.title_block}>
							<h2 className={styles.h2}>{title}</h2>
							<p className={styles.subtitle}>{subtitle}</p>
						</div>
						<Form
							values={values}
							handleChange={handleChange}
							errorsMessages={validInfo.errorsMessage}
							placeholders={formLabels}
							companySizeOptions={companySizeOptions}
						/>
						<div className={styles.formFooter}>
							<p className={styles.signUpPrompt}>
								{t.signUpPromptPrefix}
								<a className={styles.link} href={signUpUrl} target="_blank" rel="noopener noreferrer">
									{t.signUpLinkText}
								</a>
								{t.signUpPromptSuffix}
							</p>
							<div className={styles.buttonWrap}>
								<Button
									label={t.buttonChooseDate}
									icon={
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden
										>
											<path
												d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path d="M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
									}
									onClick={() => formValidation(values, validInfo, setValidInfo, errorMessages)}
								/>
							</div>
							<p className={styles.disclaimer}>
								{t.disclaimerPrefix}
								<a className={styles.link} href={privacyUrl} target="_blank" rel="noopener noreferrer">
									{t.privacyLinkText}
								</a>
								{t.disclaimerSuffix}
							</p>
						</div>
					</div>

					<div className={styles.garna_demo_cal_wrapper} hidden={!validInfo.isFormValid}>
						{/* <!-- Контейнер для Cal.com --> */}
						<div ref={calContainerRef} />
					</div>
				</div>
			</div>
		</div>
	);
}
