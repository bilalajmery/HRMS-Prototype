import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    HiOutlineHeart,
    HiOutlineChatAlt,
    HiOutlineShare,
    HiOutlinePhotograph,
    HiOutlinePaperAirplane,
    HiHeart,
    HiOutlineDotsHorizontal
} from 'react-icons/hi';
import useStore from '../../store/useStore';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

const SocialFeed = () => {
    const { posts, addPost, likePost, addComment, user } = useStore();
    const [commentOpen, setCommentOpen] = useState({});

    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        if (data.content.trim()) {
            addPost({
                content: data.content,
                author: user?.name || 'Current User',
                role: user?.role || 'Admin',
                avatar: user?.avatar,
                image: null // Placeholder for image upload
            });
            reset();
        }
    };

    const toggleComment = (postId) => {
        setCommentOpen(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleCommentSubmit = (postId, e) => {
        e.preventDefault();
        const comment = e.target.comment.value;
        if (comment.trim()) {
            addComment(postId, {
                author: user?.name || 'Current User',
                content: comment,
                avatar: user?.avatar
            });
            e.target.reset();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Social Feed</h1>
                <p className="text-slate-500">Stay connected with your team</p>
            </div>

            {/* Create Post */}
            <Card className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                        <Avatar name={user?.name} src={user?.avatar} />
                        <div className="flex-1">
                            <textarea
                                {...register('content')}
                                placeholder="Share an update, shoutout, or announcement..."
                                className="w-full border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none h-20"
                            />
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                                <div className="flex gap-2">
                                    <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                        <HiOutlinePhotograph className="w-5 h-5" />
                                    </button>
                                </div>
                                <Button type="submit" size="sm" icon={HiOutlinePaperAirplane}>Post</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Card>

            {/* Feed */}
            <div className="space-y-6">
                {posts.map(post => (
                    <Card key={post.id} className="overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar name={post.author} src={post.authorAvatar} />
                                    <div>
                                        <p className="font-bold text-slate-900">{post.author}</p>
                                        <p className="text-xs text-slate-500">{post.authorRole} • {formatDate(post.timestamp, 'relative')}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <HiOutlineDotsHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-slate-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                            {post.image && (
                                <img src={post.image} alt="Post content" className="w-full rounded-xl mb-4 object-cover max-h-96" />
                            )}

                            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-slate-500 text-sm">
                                <button
                                    onClick={() => likePost(post.id, user?.id)}
                                    className={`flex items-center gap-2 hover:text-red-500 transition-colors ${post.likes.includes(user?.id) ? 'text-red-500' : ''}`}
                                >
                                    {post.likes.includes(user?.id) ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                                    {post.likes.length} Likes
                                </button>
                                <button
                                    onClick={() => toggleComment(post.id)}
                                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <HiOutlineChatAlt className="w-5 h-5" />
                                    {post.comments.length} Comments
                                </button>
                                <button className="flex items-center gap-2 hover:text-slate-800 transition-colors ml-auto">
                                    <HiOutlineShare className="w-5 h-5" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        {commentOpen[post.id] && (
                            <div className="bg-slate-50 p-4 border-t border-slate-100">
                                <div className="space-y-4 mb-4">
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="flex gap-3">
                                            <Avatar name={comment.author} src={comment.authorAvatar} size="xs" />
                                            <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-slate-100 flex-1">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-bold text-xs text-slate-900">{comment.author}</span>
                                                    <span className="text-[10px] text-slate-400">{formatDate(comment.timestamp, 'relative')}</span>
                                                </div>
                                                <p className="text-sm text-slate-700">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex gap-3">
                                    <Avatar name={user?.name} size="xs" />
                                    <input
                                        name="comment"
                                        type="text"
                                        placeholder="Write a comment..."
                                        className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    />
                                </form>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SocialFeed;
