import { useState, useMemo } from 'react';
import {
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineBookOpen,
    HiOutlineClock,
    HiOutlineStar,
    HiOutlineCheckCircle,
    HiPlay,
    HiOutlineInformationCircle
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { COURSE_CATEGORIES, CHART_COLORS } from '../../utils/constants';
import useStore from '../../store/useStore';

const Courses = () => {
    const { courses, addToast } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState({}); // Local state for immediate feedback mock

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, categoryFilter]);

    const handleEnroll = (courseId) => {
        setEnrolledCourses(prev => ({ ...prev, [courseId]: { progress: 0, status: 'In Progress' } }));
        addToast('Successfully enrolled in course!', 'success');
        setSelectedCourse(null);
    };

    const handleContinue = (courseOrId) => {
        // Handle both direct ID call or object from list
        const id = typeof courseOrId === 'object' ? courseOrId.id : courseOrId;
        addToast(`Resuming course: ${id}`, 'info');
        // In a real app, this would navigate to the player
    };

    // Helper to check if enrolled (merging store mock + local state)
    const isEnrolled = (course) => {
        return course.enrolled || enrolledCourses[course.id];
    };

    const getProgress = (course) => {
        return enrolledCourses[course.id]?.progress || course.progress || 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Learning & Development</h1>
                    <p className="text-slate-500 mt-1">Upgrade skills with our professional course catalog</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                    size="sm"
                    variant={categoryFilter === 'All' ? 'primary' : 'outline'}
                    onClick={() => setCategoryFilter('All')}
                >
                    All
                </Button>
                {COURSE_CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        size="sm"
                        variant={categoryFilter === cat ? 'primary' : 'outline'}
                        className="whitespace-nowrap"
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map(course => {
                    const enrolled = isEnrolled(course);
                    const progress = getProgress(course);

                    return (
                        <Card key={course.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer" onClick={() => setSelectedCourse(course)}>
                            <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                {/* Gradient Background Placeholder */}
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${enrolled ? 'from-blue-100 to-indigo-100' : 'from-slate-100 to-slate-200'}`} />

                                <HiOutlineBookOpen className={`w-16 h-16 ${enrolled ? 'text-blue-300' : 'text-slate-300'} relative z-10 transform group-hover:scale-110 transition-transform duration-300`} />

                                <div className="absolute top-3 right-3 z-20">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm">{course.level}</Badge>
                                </div>

                                {enrolled && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-sm">
                                        <div className="bg-white rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                            <HiPlay className="w-8 h-8 text-blue-600 ml-1" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{course.category}</span>
                                    <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md">
                                        <HiOutlineStar className="w-4 h-4 mr-1 fill-current" />
                                        {course.rating}
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{course.description}</p>

                                <div className="space-y-4 pt-4 border-t border-slate-50 mt-auto">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <HiOutlineBookOpen className="w-4 h-4" /> {course.lessons} Lessons
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <HiOutlineClock className="w-4 h-4" /> {course.duration}
                                        </span>
                                    </div>

                                    {enrolled ? (
                                        <div>
                                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                                <span className="text-slate-700">Course Progress</span>
                                                <span className="text-blue-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <Button
                                                className="w-full mt-4"
                                                size="sm"
                                                variant="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleContinue(course);
                                                }}
                                            >
                                                Continue Learning
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEnroll(course.id);
                                            }}
                                        >
                                            Enroll Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineSearch className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or category filter</p>
                    <Button
                        variant="secondary"
                        className="mt-6"
                        onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('All');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <Modal
                    isOpen={!!selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    title="Course Details"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
                            <HiOutlineBookOpen className="w-20 h-20 text-blue-200 relative z-10" />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge>{selectedCourse.category}</Badge>
                                <Badge variant="secondary">{selectedCourse.level}</Badge>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedCourse.title}</h2>
                            <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                            <p className="text-slate-600 leading-relaxed mt-2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Lessons</p>
                                <p className="text-xl font-bold text-slate-900">{selectedCourse.lessons}</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Duration</p>
                                <p className="text-xl font-bold text-slate-900">{selectedCourse.duration}</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Rating</p>
                                <div className="flex items-center justify-center gap-1 text-xl font-bold text-slate-900">
                                    {selectedCourse.rating} <HiOutlineStar className="w-5 h-5 text-amber-500 fill-current" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setSelectedCourse(null)}>Close</Button>
                            {isEnrolled(selectedCourse) ? (
                                <Button onClick={() => handleContinue(selectedCourse)}>Continue Learning</Button>
                            ) : (
                                <Button onClick={() => handleEnroll(selectedCourse.id)}>Enroll in Course</Button>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Courses;
