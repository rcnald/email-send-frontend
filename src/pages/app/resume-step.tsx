import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CalendarDaysIcon,
	CircleAlertIcon,
	FileArchiveIcon,
	SendIcon,
	Trash2Icon,
	UserRoundIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sendEmail } from "@/api/send-email";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatBytes } from "@/hooks/use-file-upload.utils";
import { PageSeo } from "@/lib/seo";
import { cn, maskCNPJ } from "@/lib/utils";
import { useClientStore } from "@/store/client-store";
import { useFileStore } from "@/store/file-store";

export const ResumeStep = () => {
	const navigate = useNavigate();

	const [competencyDate, setCompetencyDate] = useState<Date>(new Date());

	const client = useClientStore((state) => state.client);
	const files = useFileStore((state) => state.uploadedFiles);

	const clientActions = useClientStore((state) => state.actions);
	const fileActions = useFileStore((state) => state.actions);

	const hasSelectedClient = Boolean(client);
	const hasFilesToProceed = files.length > 0;

	const clientCNPJ = maskCNPJ(client?.CNPJ ?? "");
	const totalFilesSize = files.reduce((sum, file) => sum + file.size, 0);
	const competencyLabel = format(competencyDate, "MMMM 'de' yyyy", {
		locale: ptBR,
	});

	const accountantInitials = useMemo(() => {
		const name = client?.accountant.name ?? "";

		return name
			.split(" ")
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("");
	}, [client?.accountant.name]);

	const clientInitials = useMemo(() => {
		const name = client?.name ?? "";

		return name
			.split(" ")
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("");
	}, [client?.name]);

	const { mutateAsync: sendEmailMutation } = useMutation({
		mutationFn: sendEmail,
	});

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleReviewClients = () => {
		navigate("/select-client");
	};

	const handleNextStep = () => {
		if (!(hasFilesToProceed && hasSelectedClient)) return;

		toast.promise(
			async () => {
				await sendEmailMutation({
					clientId: client?.id ?? "",
					attachmentIds: files.map((file) => file.attachmentId ?? ""),
				});
			},
			{
				loading: "Enviando...",
				success: () => {
					clientActions.clearClient();
					fileActions.clearUploadedFiles();

					return `Email enviado para ${client?.accountant.email}`;
				},
				error: (err) => (err as Error)?.message ?? "Erro ao enviar o email",
			},
		);
	};

	useEffect(() => {
		if (!(hasFilesToProceed && hasSelectedClient)) {
			navigate("/upload");
		}
	}, [hasFilesToProceed, hasSelectedClient, navigate]);

	return (
		<div className="w-full space-y-6 self-start">
			<PageSeo
				description="Revise cliente, arquivos e competencia fiscal para finalizar o envio de documentos no Invoice."
				title="Enviar"
			/>
			<div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
				<section className="space-y-4">
					<article className="rounded-xl border border-border bg-card">
						<header className="flex items-start justify-between border-border border-b px-5 py-4">
							<div>
								<h1 className="font-semibold text-2xl text-card-foreground">
									Resumo do Envio
								</h1>
								<p className="text-muted-foreground text-sm">
									Verifique os destinatarios que receberao os arquivos.
								</p>
							</div>

							<Button
								aria-label="Revisar cliente"
								onClick={handleReviewClients}
								size="icon"
								type="button"
								variant="ghost"
							>
								<Trash2Icon
									aria-hidden="true"
									className="size-4 text-primary"
								/>
							</Button>
						</header>

						<div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
							<div className="rounded-lg border border-border bg-background p-3">
								<div className="flex items-center gap-3">
									<span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary text-xs">
										{clientInitials || (
											<UserRoundIcon aria-hidden="true" className="size-4" />
										)}
									</span>

									<div className="min-w-0">
										<p className="truncate font-semibold text-foreground text-sm">
											{client?.name}
										</p>
										<p className="font-semibold text-[10px] text-primary uppercase">
											Cliente Principal
										</p>
										<p className="truncate text-muted-foreground text-xs">
											{clientCNPJ}
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-lg border border-border bg-background p-3">
								<div className="flex items-center gap-3">
									<span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary text-xs">
										{accountantInitials || (
											<UserRoundIcon aria-hidden="true" className="size-4" />
										)}
									</span>

									<div className="min-w-0">
										<p className="truncate font-semibold text-foreground text-sm">
											{client?.accountant.name}
										</p>
										<p className="font-semibold text-[10px] text-primary uppercase">
											Contador Responsavel
										</p>
										<p className="truncate text-muted-foreground text-xs">
											{client?.accountant.email}
										</p>
									</div>
								</div>
							</div>
						</div>
					</article>

					<article className="rounded-xl border border-border bg-card">
						<header className="flex items-center justify-between border-border border-b px-5 py-4">
							<h2 className="font-semibold text-card-foreground text-lg">
								Arquivos no Manifesto
							</h2>
							<span className="rounded-full bg-primary/15 px-2 py-1 font-medium text-primary text-xs">
								{files.length} itens selecionados
							</span>
						</header>

						<div className="space-y-2 p-4">
							{files.map((file) => (
								<div
									className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
									key={file.id}
								>
									<div className="flex min-w-0 items-center gap-3">
										<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/15">
											<FileArchiveIcon
												aria-hidden="true"
												className="size-5 text-primary"
											/>
										</span>

										<div className="min-w-0">
											<p className="truncate font-medium text-foreground text-sm">
												{file.name}
											</p>
											<p className="text-muted-foreground text-xs">
												{formatBytes(file.size)}
											</p>
										</div>
									</div>

									<span className="rounded-full border border-primary/30 px-2 py-1 font-medium text-[10px] text-primary uppercase">
										ZIP Archive
									</span>
								</div>
							))}
						</div>

						<footer className="flex items-center gap-2 border-border border-t px-5 py-3 text-muted-foreground text-xs">
							<CircleAlertIcon
								aria-hidden="true"
								className="size-3.5 text-primary"
							/>
							Os arquivos serao compactados em um container criptografado antes
							do envio.
						</footer>
					</article>
				</section>

				<aside className="space-y-4">
					<article className="rounded-xl border border-border bg-card p-4">
						<header className="mb-3 border-border border-b pb-3">
							<h2 className="flex items-center gap-2 font-semibold text-card-foreground text-lg">
								<CalendarDaysIcon
									aria-hidden="true"
									className="size-5 text-primary"
								/>
								Competencia Fiscal
							</h2>
							<p className="text-muted-foreground text-sm">
								Selecione o mes referente aos documentos.
							</p>
						</header>

						<Calendar
							className="w-full"
							classNames={{
								months: "w-full",
								month: "w-full",
								weekday: "size-8 text-muted-foreground",
								day: "size-8",
								day_button: cn(
									"size-8 rounded-md text-foreground",
									"group-data-selected:bg-primary group-data-selected:text-primary-foreground",
								),
								caption_label: "font-medium text-card-foreground text-sm",
								button_previous: "size-8",
								button_next: "size-8",
							}}
							mode="single"
							onSelect={(date) => {
								if (date) {
									setCompetencyDate(date);
								}
							}}
							selected={competencyDate}
						/>
					</article>

					<article className="rounded-xl border border-primary/25 bg-card p-4">
						<h3 className="text-center font-semibold text-3xl text-card-foreground tracking-tight">
							Pronto para Envio
						</h3>

						<div className="mt-4 space-y-3">
							<div className="flex items-center justify-between border-border border-b pb-2 text-sm">
								<span className="text-muted-foreground">Total de Arquivos</span>
								<span className="font-semibold text-primary">
									{files.length}
								</span>
							</div>

							<div className="flex items-center justify-between border-border border-b pb-2 text-sm">
								<span className="text-muted-foreground">Tamanho Estimado</span>
								<span className="font-semibold text-primary">
									{formatBytes(totalFilesSize)}
								</span>
							</div>

							<div className="flex items-center justify-between border-border border-b pb-2 text-sm">
								<span className="text-muted-foreground">Competencia</span>
								<span className="font-semibold text-foreground capitalize">
									{competencyLabel}
								</span>
							</div>
						</div>

						<Button
							className="mt-5 h-11 w-full"
							disabled={!hasSelectedClient}
							onClick={handleNextStep}
							type="button"
						>
							<SendIcon aria-hidden="true" className="size-4" />
							Enviar Documentos
						</Button>

						<Button
							className="mt-2 w-full"
							onClick={handleReviewClients}
							type="button"
							variant="ghost"
						>
							Revisar Clientes
						</Button>
					</article>

					<article className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-foreground text-xs">
						<p className="flex gap-2">
							<CircleAlertIcon
								aria-hidden="true"
								className="mt-0.5 size-3.5 text-primary"
							/>
							Ao clicar em Enviar, os documentos serao transmitidos via
							protocolo TLS 1.3 e arquivados por ate 3 dias.
						</p>
					</article>
				</aside>
			</div>

			<div className="flex w-full flex-col gap-3 place-self-end md:flex-row lg:ml-auto lg:w-fit">
				<Button
					className="w-full lg:w-fit"
					onClick={handleGoBack}
					type="button"
					variant="secondary"
				>
					<ArrowLeftIcon aria-hidden="true" className="opacity-80" size={16} />
					Voltar
				</Button>
				<Button
					className="group w-full lg:w-fit"
					disabled={!hasSelectedClient}
					onClick={handleNextStep}
					type="button"
				>
					Enviar
					<ArrowRightIcon
						aria-hidden="true"
						className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
						size={16}
					/>
				</Button>
			</div>
		</div>
	);
};
