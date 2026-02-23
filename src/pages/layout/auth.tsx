import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "@/api/get-profile";
import signBackground from "@/assets/sign-background.png";
import signBlur from "@/assets/sign-blur.svg";
import signFade from "@/assets/sign-fade.svg";
import signUpBackground from "@/assets/sign-up-background.png";
import signInBackground from "@/assets/sign-in-background.png";
import { LightingIcon } from "@/components/icons/lighting";
import { api, setupResponseInterceptor } from "@/lib/axios";

export const AuthLayout = () => {
	const navigate = useNavigate();

	const location = useLocation();

	const isLoginPage = location.pathname === "/sign-in";
	const isRegisterPage = location.pathname === "/sign-up";
	const isRootPath = location.pathname === "/";

	const { isLoading, isError } = useQuery({
	  queryKey: ["me"],
	  queryFn: getProfile,
	  retry: false,
	})

	useEffect(() => {
	  const interceptorId = setupResponseInterceptor(api, navigate)

	  return () => api.interceptors.response.eject(interceptorId)
	}, [navigate])

	if (isLoading) return null

	if ((!isError && isLoginPage) || isRootPath) {
	  return <Navigate replace to='/upload' />
	}

	return (
		<div className="relative flex min-h-screen border-gradient-inner text-foreground p-4 border-gradient border-gradient-tertiary">
			<img className="absolute top-0 left-0 h-full" src={signFade} />
			<img className="absolute right-0 top-0 h-full" src={signBlur} />

			<div className="flex-1 hidden md:flex items-end justify-center w-full relative border-gradient border-gradient-transparent">
				<img
					className="absolute h-full object-fill inset-0 w-full -z-50"
					src={isRegisterPage ? signUpBackground : signInBackground}
				/>
				<div className="w-full flex flex-col gap-4 m-10 max-w-135">
					<div className="bg-muted items-center gap-2 flex p-0.5 w-fit rounded-sm">
						<span className="flex border-sidebar-ring/20  border shadow-(--badge-shadow) text-primary items-center font-mono uppercase py-1 text-[10px] font-bold px-2 bg-badge-bg rounded-[6px] gap-1">
							<LightingIcon />
							<span className="whitespace-nowrap">Tempo Real</span>
						</span>
						<span className="font-sans text-[10px] mr-2 text-muted-foreground">
							Monitore seus envios instantaneamente.
						</span>
					</div>
					<h1 className="text-foreground font-jakarta text-2xl font-semibold">
						Sua Plataforma Centralizada <br /> para Envio de Documentos Fiscais
					</h1>
					<p className="font-sans text-muted-foreground text-xs">
						Gerencie sua base de clientes e contadores, padronize o envio <br />{" "}
						de arquivos zip automatizados.
					</p>
				</div>
			</div>

			<div className="relative w-full p-4 flex justify-center items-center flex-1">
				<img
					className="absolute object-cover h-full inset-0 w-full -z-50"
					src={signBackground}
				/>
				<Outlet />
			</div>
		</div>
	);
};
