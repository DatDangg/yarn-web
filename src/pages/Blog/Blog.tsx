import { useState, useEffect, useMemo } from "react";
import { Empty } from "antd";
import BlogCard from "../../components/BlogCard/BlogCard";
import PageBanner from "../../components/ui/PageBanner";
import { useTranslation } from "react-i18next";
import CustomPagination from "../../components/ui/CustomPagination";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import { BlogProps } from "../../interfaces/blog";

function Blog() {
    const { t } = useTranslation();
    const API = process.env.REACT_APP_API_URL;

    const [blogs, setBlogs] = useState<BlogProps[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const pageSize = 9;
    const debouncedSearchValue = useDebounce(searchValue, 1000);

    useEffect(() => {
        axios.get(`${API}/blog`)
            .then(res => {
                setBlogs(res.data);
                setFilteredBlogs(res.data);
            })
            .catch(err => {
                console.error(err);
                setBlogs([]);
                setFilteredBlogs([]);
            });
    }, [API]);

    useEffect(() => {
        const keyword = debouncedSearchValue.toLowerCase().trim();
        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(keyword)
        );
        setCurrentPage(1);
        setFilteredBlogs(filtered);
    }, [debouncedSearchValue, blogs]);

    const currentBlogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredBlogs.slice(startIndex, startIndex + pageSize);
    }, [filteredBlogs, currentPage]);

    return (
        <div className="mb-[24px] mt-[100px]">
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
                                    peer-placeholder-shown:top-[18%] peer-placeholder-shown:text-[22px] peer-placeholder-shown:text-[24px] peer-placeholder-shown:text-[var(--text-color)] peer-placeholder-shown:font-[family-name:var(--font-Dancing)]
                                    peer-focus:font-[family-name:var(--font-Gentium)] peer-focus:top-[-11px] peer-focus:leading-[20px] peer-focus:font-[500] peer-focus:text-[20px] peer-focus:text-[var(--active-color)]"
                            >
                                {t("blogFind")}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {currentBlogs.length > 0 ? (
                        <>
                            {currentBlogs.map(blog => (
                            <div
                                key={blog.id}
                                className="col-lg-4 my-[36px] flex-col items-center justify-center text-center"
                                style={{ padding: "6px 26px" }}
                            >
                                <BlogCard id={blog.id} title={blog.title} category={blog.category} image={blog.image} />
                            </div>
                            ))}
                            <div className="text-center flex justify-center mt-2">
                                <CustomPagination
                                    currentPage={currentPage}
                                    pageSize={pageSize}
                                    total={filteredBlogs.length}
                                    onChange={page => setCurrentPage(page)}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="mt-[36px] w-full text-center">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}

export default Blog;
