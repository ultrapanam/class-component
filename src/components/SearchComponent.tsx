import React from 'react';
import { PokemonResult } from '../types';

interface SearchComponentProps {
    onSetResults: (results: PokemonResult[]) => void;
}

interface SearchComponentState {
    searchTerm: string;
    isLoading: boolean;
    errorMessage: string;
}

class SearchComponent extends React.Component<SearchComponentProps, SearchComponentState> {
    constructor(props: SearchComponentProps) {
        super(props);
        this.state = {
            searchTerm: localStorage.getItem('searchTerm') || '',
            isLoading: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        this.handleSearch(this.state.searchTerm);
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value.trim();
        this.setState({ searchTerm });
        localStorage.setItem('searchTerm', searchTerm);
    }

    handleSearch = async (searchTerm: string = '') => {
        this.setState({ isLoading: true, errorMessage: '' });

        let url: string;
        if (searchTerm) {
            const formattedSearchTerm = searchTerm.toLowerCase();
            url = `https://pokeapi.co/api/v2/pokemon/${formattedSearchTerm}`;
        } else {
            url = `https://pokeapi.co/api/v2/pokemon?limit=10`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No Pokémon found with that name. Try 'Pikachu'");
                } else {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
            }
            const data = await response.json();

            let results: PokemonResult[];
            if (searchTerm) {
                results = [{
                    name: data.name,
                    artwork: data.sprites.other['official-artwork'].front_default
                }];
            } else {
                results = data.results.map((item: { name: string; url: string }) => ({
                    name: item.name,
                    artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.url.split('/').slice(-2, -1)}.png`
                }));
            }
            this.props.onSetResults(results);
        } catch (error: unknown) {
            let message = 'An unexpected error occurred';
            if (error instanceof Error) {
                message = error.message;
            }
            this.setState({ errorMessage: message });
            this.props.onSetResults([]);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    value={this.state.searchTerm}
                    onChange={this.handleChange}
                    placeholder="Search Pokémon"
                />
                <button onClick={() => this.handleSearch(this.state.searchTerm)} disabled={this.state.isLoading}>
                    Search
                </button>
                <button onClick={() => { throw new Error("Test Error"); }}>Trigger Error</button>
                {this.state.isLoading && <p>Loading...</p>}
                {this.state.errorMessage && <p className="error">{this.state.errorMessage}</p>}
            </div>
        );
    }
}

export default SearchComponent;
