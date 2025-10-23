import { Card } from '../ui/card';

const ImageCard = ({
    imageUrl,
    changed,
}: {
    imageUrl: string;
    changed: boolean;
}) => {
    return (
        <Card
            className={`overflow-hidden ${changed ? 'border-2 border-indigo-600' : ''}`}
        >
            <img
                src={imageUrl || '/placeholder.svg'}
                alt="After"
                className="w-full h-auto"
            />
        </Card>
    );
};

export default ImageCard;
