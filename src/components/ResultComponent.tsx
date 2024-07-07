import React from 'react';

interface PokemonResult {
    name: string;
    artwork?: string;
}

interface ResultComponentProps {
    data: PokemonResult[];
}

class ResultComponent extends React.Component<ResultComponentProps> {
    render() {
        return (
            <div className='results-container'>
                {this.props.data.map((pokemon, index) => (
                    <div key={index}>
                        <h3>{pokemon.name}</h3>
                        <div className='pokemon-img'>
                            {pokemon.artwork && (
                                <img src={pokemon.artwork} alt={`${pokemon.name} official artwork`} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default ResultComponent;
