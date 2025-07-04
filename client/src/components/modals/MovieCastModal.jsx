import { XIcon } from 'lucide-react';
import React, { useState } from 'react';

const MovieCastModal = ({ casts, setShowCastModal }) => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(casts.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentBatch = casts.slice(startIdx, startIdx + itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className='fixed inset-0 flex flex-col items-center justify-center z-50 p-6 text-white' style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} onClick={() => setShowCastModal(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                <button className='bg-primary flex items-center justify-center rounded-full hover:bg-primary-dull hover:h-[35px] hover:w-[35px] duration-300 h-[30px] w-[30px] ml-80 mb-10 mt-5' onClick={() => setShowCastModal(false)}><XIcon /></button>
            </div>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3' onClick={(e) => e.stopPropagation()}>
                {currentBatch.map((cast) => (
                    <div key={cast.name} className='flex flex-col items-center'>
                        <div className='h-[101.94px] w-[101.94px] rounded-full overflow-hidden'>
                            <img
                                src={cast.profile_path || '/placeholder.jpg'}
                                alt={`Photo of ${cast.name}`}
                                onError={(e) => (e.target.src = '/placeholder.jpg')}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <p className='mt-2'>{cast.name}</p>
                        <p className='text-sm text-gray-400'>{cast.character}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className='mt-6 flex items-center gap-4' onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MovieCastModal;
