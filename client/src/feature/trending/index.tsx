import {FC} from 'react';
import { TrendingBanner } from './components/TrendingBanner';
import { TrendingPosts } from './components/TrendingPosts';

export const Trending: FC = (): JSX.Element => {
    return (
        <div>
            <TrendingBanner/>
            <TrendingPosts />
        </div>
    )
}