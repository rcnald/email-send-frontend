import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, LogOut, Send, Upload, User } from "lucide-react";
import type { ComponentProps, ElementType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/api/logout";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClientStore } from "@/store/client-store";
import { useFileStore } from "@/store/file-store";

type SidebarProps = ComponentProps<"aside">;

type WorkflowItem = {
	icon: ElementType;
	label: string;
	pathname: "/upload" | "/select-client" | "/resume";
	canNavigate: boolean;
};

export function Sidebar({ className, ...props }: SidebarProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const hasFilesToProceed = useFileStore(
		(state) => state.uploadedFiles.length > 0,
	);
	const clearUploadedFiles = useFileStore(
		(state) => state.actions.clearUploadedFiles,
	);

	const hasClientToProceed = useClientStore((state) => Boolean(state.client));
	const clearClient = useClientStore((state) => state.actions.clearClient);

	const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
		mutationFn: logout,
	});

	const workflowItems: WorkflowItem[] = [
		{
			icon: Upload,
			label: "Upload Files",
			pathname: "/upload",
			canNavigate: true,
		},
		{
			icon: User,
			label: "Select Clients",
			pathname: "/select-client",
			canNavigate: hasFilesToProceed,
		},
		{
			icon: Send,
			label: "Review & Send",
			pathname: "/resume",
			canNavigate: hasFilesToProceed && hasClientToProceed,
		},
	];

	const handleLogout = async () => {
		try {
			await logoutMutation();
		} finally {
			Cookies.remove("accessToken");
			Cookies.remove("refreshToken");
			clearClient();
			clearUploadedFiles();
			navigate("/sign-in", { replace: true });
		}
	};

	return (
		<aside
			className={cn(
				"sticky top-0 flex h-screen w-full max-w-[272px] shrink-0 flex-col border-white/10 border-r bg-[#171c28] px-4 py-6 text-[#c7ceda]",
				className,
			)}
			{...props}
		>
			<div className="border-white/20 border-t pt-5">
				<p className="mb-3 font-semibold text-[11px] tracking-wide text-white/60 uppercase">
					Workflow
				</p>

				<nav aria-label="Workflow steps" className="flex flex-col gap-2">
					{workflowItems.map((item) => {
						const isActive = pathname === item.pathname;
						const Icon = item.icon;

						if (!item.canNavigate) {
							return (
								<button
									className="flex h-11 items-center gap-3 rounded-lg px-3 font-medium text-[15px] text-white/45"
									disabled
									key={item.pathname}
									type="button"
								>
									<Icon aria-hidden="true" size={16} />
									<span>{item.label}</span>
								</button>
							);
						}

						return (
							<Link
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"group flex h-11 items-center justify-between rounded-lg px-3 font-medium text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
									isActive
										? "bg-[#401329] text-primary"
										: "text-white/85 hover:bg-white/5 hover:text-white",
								)}
								key={item.pathname}
								to={item.pathname}
							>
								<span className="flex items-center gap-3">
									<Icon aria-hidden="true" size={16} />
									<span>{item.label}</span>
								</span>
								<ChevronRight
									aria-hidden="true"
									className={cn(
										"transition-transform duration-200",
										isActive
											? "text-primary"
											: "translate-x-0.5 text-white/45 group-hover:translate-x-1 group-hover:text-white/70",
									)}
									size={16}
								/>
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="mt-auto border-white/10 border-t pt-4">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							className="w-full justify-start gap-3 px-3 text-[#ff375f] hover:bg-[#ff375f]/10 hover:text-[#ff375f]"
							type="button"
							variant="ghost"
						>
							<LogOut aria-hidden="true" size={16} />
							Logout
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure you want to logout?
							</AlertDialogTitle>
							<AlertDialogDescription>
								You will need to sign in again to continue.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button asChild variant="destructive">
								<AlertDialogAction disabled={isLoggingOut} onClick={handleLogout}>
									{isLoggingOut ? "Logging out..." : "Logout"}
								</AlertDialogAction>
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</aside>
	);
}
