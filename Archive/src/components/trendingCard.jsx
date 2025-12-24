import React from 'react'

const TrendingCard = ({movie,id}) => {
    return (
        <li key={id} className="flex">
            <p className="text-black">{id}</p>
            <img src={movie.poster_url.split(500)[1] != 'null' ? movie.poster_url : '/no-movie.png'} alt="" />
        </li>

    )
}
export default TrendingCard
