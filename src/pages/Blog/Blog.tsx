import { useState, useEffect } from "react";
import { Pagination } from "antd";
import BlogCard from "../../components/BlogCard/BlogCard";
import PageBanner from "../../components/ui/PageBanner";
import { useTranslation } from "react-i18next";
import CustomPagination from "../../components/ui/CustomPagination";

interface BlogProps {
    id: number;
    image: string;
    title: string;
    category: string;
}

function Blog() {
    const { t } = useTranslation();
    
    const blogs: BlogProps[] = [
        { id: 1, image: "/blog1.jpg", title: "How to crochet a table lamps", category: "Crochet" },
        { id: 2, image: "/blog2.jpg", title: "How to crochet sun and moon", category: "Crochet" },
        { id: 3, image: "/blog3.jpg", title: "How to crochet jelly fish", category: "Crochet" },
        { id: 4, image: "/blog2.jpg", title: "How to crochet sun and moon", category: "Crochet" },
        { id: 5, image: "/blog3.jpg", title: "How to crochet jelly fish", category: "Crochet" },
        { id: 6, image: "/blog1.jpg", title: "How to crochet a table lamps", category: "Crochet" },
        { id: 7, image: "/blog2.jpg", title: "How to crochet sun and moon", category: "Crochet" },
        { id: 8, image: "/blog3.jpg", title: "How to crochet jelly fish", category: "Crochet" },
        { id: 9, image: "/blog2.jpg", title: "How to crochet sun and moon", category: "Crochet" },
        { id: 10, image: "/blog1.jpg", title: "How to crochet a table lamps", category: "Crochet" },
        { id: 11, image: "/blog2.jpg", title: "How to crochet sun and moon", category: "Crochet" },
        { id: 12, image: "/blog3.jpg", title: "How to crochet jelly fish", category: "Crochet" },
        { id: 13, image: "/blog1.jpg", title: "How to crochet a table lamps", category: "Crochet" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogProps[]>(blogs);
    const pageSize = 9;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    useEffect(() => {
        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(debouncedSearchValue.toLowerCase())
        );
        setCurrentPage(1);
        setFilteredBlogs(filtered);
    }, [debouncedSearchValue]);

    const startIndex = (currentPage - 1) * pageSize;
    const currentBlogs = filteredBlogs.slice(startIndex, startIndex + pageSize);

    return (
        <div className="mb-[24px]">
            <PageBanner name="Blog" />

            <div className="relative pt-[28px]">
                <img className="absolute" src="/line.png" alt="line" />
                <img className="absolute" src="/line1.png" alt="line1" />
            </div>

            <div className="container mt-[32px]">
                <div className="row pb-[32px]">
                    <div className="flex flex-col justify-end items-end">
                        <div className="relative w-[450px]">
                            <input
                                id="search"
                                placeholder=" "
                                value={searchValue}
                                className="peer w-full text-[20px] border-[1px] border-[var(--border-color)] rounded px-[12px] py-[8px] placeholder-transparent focus:outline-none focus:border-[1px] focus:border-[var(--outline-color)]"
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <label
                                htmlFor="search"
                                className="absolute left-3 top-[-18px] text-[20px] text-gray-500 transition-all duration-200 font-[family-name:var(--font-Gentium)] bg-white px-1 pointer-events-none
                                           peer-placeholder-shown:top-[22%] peer-placeholder-shown:text-base peer-placeholder-shown:text-[24px] peer-placeholder-shown:text-[var(--text-color)] peer-placeholder-shown:font-[family-name:var(--font-Dancing)]
                                           peer-focus:font-[family-name:var(--font-Gentium)] peer-focus:top-[-11px] peer-focus:leading-[20px] peer-focus:font-[500] peer-focus:text-[20px] peer-focus:text-[var(--active-color)] "
                            >
                                {t("blogFind")}
                            </label >
                        </div>

                    </div>
                </div>

                <div className="row">
                    {currentBlogs.map(blog => (
                        <div key={blog.id} className="col-lg-4 my-[36px] flex-col items-center justify-center text-center" style={{ padding: "6px 26px" }}>
                            <BlogCard title={blog.title} category={blog.category} image={blog.image} />
                        </div>
                    ))}
                </div>

                <div className="text-center flex justify-center mt-2">
                    <CustomPagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={filteredBlogs.length}
                        onChange={(page) => setCurrentPage(page)}
                        />

                </div>
            </div>
        </div>
    );
}

export default Blog;
