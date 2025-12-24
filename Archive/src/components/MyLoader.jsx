import React from 'react'
import Skeleton from "react-loading-skeleton";

const MyLoader = () => {
    return (
        <div className="movie-card">
            <li className="flex flex-col gap-2 ">
                <Skeleton height={180}
                          width="100%"
                          baseColor="#2b2b3d"
                          highlightColor="#40405a"
                          borderRadius={8}

                />          {/* Poster */}
                <div className="flex flex-col gap-2">
                    <Skeleton width="100%" height={20}  baseColor="#2b2b3d" highlightColor="#40405a" borderRadius={8}/>         {/* Title */}
                    <div className="flex gap-3 ">
                        <div className="w-1/3">
                            <Skeleton width="100%" height={20}  baseColor="#2b2b3d" highlightColor="#40405a" borderRadius={8}/>
                        </div>
                        <div className="w-1/3">
                            <Skeleton width="100%" height={20}  baseColor="#2b2b3d" highlightColor="#40405a" borderRadius={8}/>
                        </div>
                        <div className="w-1/3">
                            <Skeleton width="100%" height={20}  baseColor="#2b2b3d" highlightColor="#40405a" borderRadius={8}/>
                        </div>

                    </div>
                </div>
            </li>

        </div>

    );
}
export default MyLoader;

