import Head from 'next/head';
import { MetaProps } from '../../app/interfaces/hooks';

const Meta = ({ title = 'Gauzy Teams', keywords = '', description = '' }: Partial<MetaProps>) => {
	return (
		<Head>
			<meta name="keywords" content={keywords} />
			<meta name="description" content={description} />
			<title>{title}</title>
		</Head>
	);
};

export default Meta;