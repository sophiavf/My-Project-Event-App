import React from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
	return (
		<nav className="flex justify-center pb-4 ">
			<ul className="flex list-none my-2 items-center">
				<li>
					<Link
						to={`/events/page/${currentPage > 1 ? currentPage - 1 : 1}`}
						className={`px-2 py-1 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "bg-white border border-primary text-primary"} rounded-md`}
					>
						Back
					</Link>
				</li>
				<li className="mx-2">
					<div className="px-2 py-1 bg-white border border-neutral2 text-neutral2 rounded-md">
						Page {currentPage} of {totalPages}
					</div>
				</li>
				<li>
					<Link
						to={`/events/page/${currentPage < totalPages ? currentPage + 1 : totalPages}`}
						className={`px-2 py-1 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "bg-white border border-primary text-primary "} rounded-md`}
					>
						Next
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
