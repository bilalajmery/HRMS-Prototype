import { useState } from 'react';
import {
    HiOutlineHeart,
    HiOutlineShieldCheck,
    HiOutlineAcademicCap,
    HiOutlineGlobe,
    HiOutlineCheck,
    HiOutlineInformationCircle
} from 'react-icons/hi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const Benefits = () => {
    const [enrolledBenefits, setEnrolledBenefits] = useState(['1', '3']); // Mock enrolled IDs
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState(null);

    const benefitsCatalog = [
        {
            id: '1',
            title: 'Health Insurance Premium',
            provider: 'BlueCross',
            cost: 0,
            coverage: 'Full medical, dental, and vision coverage for employee and dependents.',
            icon: HiOutlineHeart,
            color: 'text-rose-500',
            bg: 'bg-rose-50'
        },
        {
            id: '2',
            title: '401(k) Retirement Plan',
            provider: 'Fidelity',
            cost: 0,
            coverage: 'Company matches up to 5% of your salary contributions.',
            icon: HiOutlineShieldCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            id: '3',
            title: 'Learning Stipend',
            provider: 'Udemy / Coursera',
            cost: 0,
            coverage: '$1000 annual budget for courses, books, and conferences.',
            icon: HiOutlineAcademicCap,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: '4',
            title: 'Remote Work Setup',
            provider: 'Internal',
            cost: 0,
            coverage: 'One-time $500 allowance for home office equipment.',
            icon: HiOutlineGlobe,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        }
    ];

    const handleEnroll = (id) => {
        setEnrolledBenefits(prev => [...prev, id]);
        setModalOpen(false);
    };

    const handleOptOut = (id) => {
        setEnrolledBenefits(prev => prev.filter(b => b !== id));
        setModalOpen(false);
    };

    const openDetails = (benefit) => {
        setSelectedBenefit(benefit);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900">My Benefits</h1>
                <p className="text-slate-500">View and manage your employee perks and coverage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefitsCatalog.map(benefit => {
                    const isEnrolled = enrolledBenefits.includes(benefit.id);
                    const Icon = benefit.icon;

                    return (
                        <Card key={benefit.id} className={`relative overflow-hidden transition-all hover:shadow-md ${isEnrolled ? 'border-l-4 border-l-green-500' : ''}`}>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${benefit.bg} ${benefit.color}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    {isEnrolled ? (
                                        <Badge variant="success" className="flex items-center gap-1">
                                            <HiOutlineCheck className="w-3 h-3" /> Enrolled
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Available</Badge>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1">{benefit.title}</h3>
                                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-4">{benefit.provider}</p>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-2">{benefit.coverage}</p>

                                <Button
                                    variant={isEnrolled ? "secondary" : "primary"}
                                    className="w-full"
                                    onClick={() => openDetails(benefit)}
                                >
                                    {isEnrolled ? 'Manage' : 'View Details'}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Summary Section */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold">Total Benefit Value</h3>
                    <p className="text-slate-400 mt-2 max-w-lg">
                        Your total package includes salary plus an estimated <span className="text-white font-bold">$12,500</span> in annual benefits, perk allowances, and insurance contributions.
                    </p>
                </div>
                <div className="text-center md:text-right">
                    <span className="block text-4xl font-bold text-emerald-400">$12,500</span>
                    <span className="text-sm text-slate-400">/ per year</span>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedBenefit?.title}
                size="md"
                footer={
                    selectedBenefit && enrolledBenefits.includes(selectedBenefit.id) ? (
                        <Button variant="danger" onClick={() => handleOptOut(selectedBenefit.id)} className="w-full">Opt Out</Button>
                    ) : (
                        <Button onClick={() => handleEnroll(selectedBenefit?.id)} className="w-full">Enroll Now</Button>
                    )
                }
            >
                {selectedBenefit && (
                    <div className="space-y-4">
                        <div className={`flex items-center gap-4 p-4 rounded-xl ${selectedBenefit.bg} border border-${selectedBenefit.color.split('-')[1]}-100`}>
                            <selectedBenefit.icon className={`w-10 h-10 ${selectedBenefit.color}`} />
                            <div>
                                <h4 className={`font-bold ${selectedBenefit.color} text-lg`}>{selectedBenefit.provider}</h4>
                                <p className="text-slate-600 text-sm">Provider</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h5 className="font-bold text-slate-900 text-sm uppercase mb-2">Coverage Details</h5>
                                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    {selectedBenefit.coverage}
                                </p>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                                <HiOutlineInformationCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>Enrolling in this benefit may affect your monthly take-home pay depending on the chosen plan tier. Please review the handbook for full policy details.</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Benefits;
