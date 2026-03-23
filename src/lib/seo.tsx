import { Helmet } from "react-helmet-async";

const APP_NAME = "Invoice";
const TITLE_TEMPLATE = "%s | Invoice";

interface PageSeoProps {
	title: string;
	description: string;
}

export const PageSeo = ({ title, description }: PageSeoProps) => {
	const resolvedTitle = TITLE_TEMPLATE.replace("%s", title);

	return (
		<Helmet
			defaultTitle={APP_NAME}
			title={title}
			titleTemplate={TITLE_TEMPLATE}
		>
			<meta content={description} name="description" />
			<meta content={resolvedTitle} property="og:title" />
			<meta content={description} property="og:description" />
		</Helmet>
	);
};
