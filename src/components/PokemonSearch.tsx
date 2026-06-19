import React, { useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    Image,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonRequests from "../services/PokemonRequests";

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [pokemon, setPokemon] = useState<{
        pokemon_name: string;
        pokemon_id: number;
        pokemon_image: string;
        types: string[];
        description?: string;
    } | null>(null);


    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setErrorMsg("");
        Keyboard.dismiss();

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                setPokemon(result);
                setSearchQuery("");
            } else {
                setPokemon(null);
                setErrorMsg("Pokémon não encontrado. Verifique o nome ou número.");
            }
        } catch (error) {
            setPokemon(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>PokéSearch 🔍</Text>

                <Text style={{ marginBottom: 20 }}>
                    Atividade Avaliativa: busque um Pokémon pelo nome ou número.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome ou ID (ex: bulbasaur ou 1)"
                    placeholderTextColor="#8d8d99"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                />

                {errorMsg ? <Text style={{ color: "red", marginTop: 10 }}>{errorMsg}</Text> : null}

                {pokemon && (
                    <View>
                        <Image
                            source={{ uri: pokemon.pokemon_image }}
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {pokemon.pokemon_name} (#{pokemon.pokemon_id})
                        </Text>

                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                            {pokemon.types.map((type) => (
                                <View
                                    key={type}
                                    style={{
                                        backgroundColor: TYPE_COLORS[type] || "#777",
                                        paddingVertical: 4,
                                        paddingHorizontal: 10,
                                        borderRadius: 12,
                                        marginRight: 6,
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                        {type.toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}


            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#e1e1e6",
        color: "#121214",
        fontSize: 16,
        borderRadius: 6,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#323238",
    },

});
const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};
