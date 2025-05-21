import { useState, useEffect } from "react";
import { Pagination } from "antd";
import BlogCard from "../../components/BlogCard/BlogCard";
import PageBanner from "../../components/ui/PageBanner";

interface BlogProps {
    id: number;
    image: string;
    title: string;
    category: string;
}

function Blog() {
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

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 1000); // 300ms debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    // Filter blogs when debounced value changes
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
                        <label htmlFor="search" className="mb-[5px]">Search</label>
                        <input
                            id="search"
                            value={searchValue}
                            className="w-[300px] border-1 border-[black] px-[12px] py-[6px] rounded-[7px]"
                            onChange={e => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row">
                    {currentBlogs.map(blog => (
                        <div key={blog.id} className="col-lg-4 my-[36px] flex-col items-center justify-center text-center">
                            <BlogCard title={blog.title} category={blog.category} image={blog.image} />
                        </div>
                    ))}
                </div>

                <div className="text-center flex justify-center mt-2">
                    <Pagination
                        current={currentPage}
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
