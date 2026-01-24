import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    type = 'website',
    image = '/og-image.png', // Default OG image
    url = window.location.href
}) => {
    const siteName = 'HRMS Pro';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = 'Professional Human Resource Management System for modern enterprises. Streamline your HR operations with HRMS Pro.';
    const defaultKeywords = 'HRMS, HR, Human Resources, Employee Management, Payroll, Performance, Recruitment, Attendance';

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
