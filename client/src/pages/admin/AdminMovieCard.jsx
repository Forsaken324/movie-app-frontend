import { StarIcon } from 'lucide-react';

const AdminMovieCard = ({ show }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  return (
    <div className="h-[267px] w-[268px] rounded-xl bg-primary/10 border border-primary/20 border-t-0 text-white overflow-hidden shadow-md">
      <img
        src={show.movie.backdrop_path}
        alt={show.movie.title}
        className="h-[178px] w-full object-cover rounded-t-xl"
      />
      <div className="px-3 py-2">
        <p className="text-sm font-semibold truncate">{show.movie.title}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-xl">{currency}{show.showPrice}</p>
          <div className="flex items-center gap-1 text-sm">
            <StarIcon className="fill-primary text-primary w-4 h-4" />
            <p className='text-gray-400'>{show.movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;



    // movie payload
    // {
    //     "_id": "324544",
    //     "id": 324544,
    //     "title": "In the Lost Lands",
    //     "overview": "A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power, where she and her guide, the drifter Boyce, must outwit and outfight both man and demon.",
    //     "poster_path": "https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg",
    //     "backdrop_path": "https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg",
    //     "genres": [
    //         { "id": 28, "name": "Action" },
    //         { "id": 14, "name": "Fantasy" },
    //         { "id": 12, "name": "Adventure" },
    //     ],
    //     "casts": dummyCastsData,
    //     "release_date": "2025-02-27",
    //     "original_language": "en",
    //     "tagline": "She seeks the power to free her people.",
    //     "vote_average": 6.4,
    //     "vote_count": 15000,
    //     "runtime": 102,
    // },

    
        // active show payload
        // {
        //     "_id": "68352363e96d99513e4221a4",
        //     "movie": dummyShowsData[0],
        //     "showDateTime": "2025-06-30T02:30:00.000Z",
        //     "showPrice": 59,
        //     "occupiedSeats": {
        //         "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        //         "B1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        //         "C1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
        //     },
        // },