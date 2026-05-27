import React, { useMemo, useState } from "react";

const initialPosts = [
    {
        id: 1,
        title: "Aftermovie teaser for Lagos Sound Summit",
        author: "CityWave Media",
        category: "Promotion",
        reports: 0,
        status: "Approved",
    },
    {
        id: 2,
        title: "Win backstage passes now",
        author: "Unknown Promoter",
        category: "Campaign",
        reports: 7,
        status: "Under Review",
    },
    {
        id: 3,
        title: "Community meetup recap",
        author: "Haus Creative",
        category: "Community",
        reports: 1,
        status: "Pending",
    },
];

const AdminModeratePosts = ({ searchTerm = "", onActivity }) => {
    const [posts, setPosts] = useState(initialPosts);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) =>
            `${post.title} ${post.author} ${post.status} ${post.category}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [posts, searchTerm]);

    const handleDeletePost = (postId) => {
        const target = posts.find((post) => post.id === postId);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        if (target && onActivity) onActivity(`Deleted post "${target.title}".`);
    };

    const handleModeratePost = (postId, status) => {
        const target = posts.find((post) => post.id === postId);
        if (!target) return;

        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId ? { ...post, status } : post,
            ),
        );

        if (onActivity) onActivity(`${status} post "${target.title}".`);
    };

    return (
        <section className="admin-card" data-aos="fade-up">
            <div className="mb-4">
                <p className="admin-section-kicker">Content Moderation</p>
                <h4 className="m-0">Approve, review, or delete community posts</h4>
            </div>

            <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Post</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Reports</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post, index) => (
                            <tr key={post.id} data-aos="fade-up" data-aos-delay={Math.min(index * 60, 220)}>
                                <td className="fw-semibold">{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.category}</td>
                                <td>{post.reports}</td>
                                <td>
                                    <span
                                        className={`admin-status-chip ${post.status.toLowerCase().replace(/\s+/g, "-")}`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() => handleModeratePost(post.id, "Approved")}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn"
                                            onClick={() => handleModeratePost(post.id, "Under Review")}
                                        >
                                            Review
                                        </button>
                                        <button
                                            type="button"
                                            className="btn admin-mini-btn danger"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminModeratePosts;
