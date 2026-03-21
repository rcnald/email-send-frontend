import { Helmet } from "react-helmet-async"

const APP_NAME = "Invoice"

const ROUTE_PAGE_LABELS: Record<string, string> = {
  "/sign-in": "Sign In",
  "/sign-up": "Sign Up",
  "/upload": "Upload",
  "/select-client": "Select Client",
  "/resume": "Resume",
}

export const getPageTitle = (pathname: string) => {
  const pageLabel = ROUTE_PAGE_LABELS[pathname]

  if (!pageLabel) {
    return APP_NAME
  }

  return `${pageLabel} | ${APP_NAME}`
}

interface PageSeoProps {
  title: string
  description?: string
}

export const PageSeo = ({ title, description }: PageSeoProps) => {
  const pageTitle = `${title} | ${APP_NAME}`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description ? <meta content={description} name='description' /> : null}
      <meta content={pageTitle} property='og:title' />
      {description ? (
        <meta content={description} property='og:description' />
      ) : null}
    </Helmet>
  )
}
