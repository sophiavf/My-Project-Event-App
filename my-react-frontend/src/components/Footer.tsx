export default function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="text-center bg-secondary text-neutral1 p-3">
			<div className="footerContent">
				Author: Sophia <a className="underline" href="https://github.com/sophiavf">GitHub</a> &copy;{currentYear}
			</div>
		</footer>
	);
}