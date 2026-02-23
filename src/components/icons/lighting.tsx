export const LightingIcon = ({
	className,
	...props
}: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			{...props}
		>
			<g clip-path="url(#clip0_967_4076)">
				<path
					d="M6.48419 0.235888L3.11297 5.81825C2.90773 6.15794 3.06343 6.43315 3.45975 6.43315H5.67532C6.07217 6.43315 6.28734 6.73665 6.15602 7.11123L4.54903 11.6944C4.41771 12.0692 4.48822 12.1038 4.70627 11.7725L8.87691 5.43162C9.09497 5.09979 8.95007 4.83142 8.55346 4.83142H5.8782C5.48136 4.83142 5.25964 4.52556 5.38204 4.14838L6.63334 0.304317C6.75627 -0.0731539 6.68972 -0.103514 6.48419 0.235888Z"
					fill="#FE003E"
				/>
			</g>
			<defs>
				<clipPath id="clip0_967_4076">
					<rect width="12" height="12" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};
