import React, { useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonRequests from "../services/PokemonRequests";

interface PokemonData {
    pokemon_name: string;
    pokemon_id: number;
    pokemon_image: string;
    types: string[];
    description?: string;
}

const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F4C430",
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

function getTypeColor(type: string) {
    return TYPE_COLORS[type.toLowerCase()] || "#777";
}

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);

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
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.title}>PokéSearch</Text>
            <Text style={styles.subtitle}>Busque por nome ou número</Text>

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: pikachu ou 25"
                    placeholderTextColor="#B7B7C2"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.searchButton,
                        pressed && styles.searchButtonPressed,
                    ]}
                    onPress={handleSearch}
                    disabled={loading}
                >
                    <Text style={styles.searchButtonIcon}>
                        {loading ? "..." : "🔍"}
                    </Text>
                </Pressable>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            {!pokemon && !errorMsg && !loading && (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconCircle}>
                        <Text style={styles.emptyIcon}>👾</Text>
                    </View>
                    <Text style={styles.emptyTitle}>Nenhum Pokémon ainda</Text>
                    <Text style={styles.emptyText}>
                        Digite um nome ou número acima para começar sua busca.
                    </Text>
                </View>
            )}

            {pokemon && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.pokemonName}>
                                {pokemon.pokemon_name}
                            </Text>
                            <Text style={styles.pokemonId}>
                                #{String(pokemon.pokemon_id).padStart(4, "0")}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.typeBadge,
                                { backgroundColor: getTypeColor(pokemon.types[0]) },
                            ]}
                        >
                            <Text style={styles.typeBadgeText}>
                                {pokemon.types[0].toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.imageBox,
                            { backgroundColor: `${getTypeColor(pokemon.types[0])}1F` },
                        ]}
                    >
                        <Image
                            source={{ uri: pokemon.pokemon_image }}
                            style={styles.pokemonImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionLabel}>DESCRIÇÃO</Text>
                        <Text style={styles.descriptionText}>
                            {pokemon.description || "Nenhuma descrição encontrada."}
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#d5d5e4",
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#1C1C28",
        textAlign: "center",
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 14,
        color: "#8C8C99",
        textAlign: "center",
        marginBottom: 22,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 20,
        fontSize: 15,
        color: "#1C1C28",
        borderWidth: 1,
        borderColor: "#ECECF1",
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    searchButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#a5a5a5",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF6B35",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    searchButtonPressed: {
        backgroundColor: "#E65C2A",
        transform: [{ scale: 0.96 }],
    },
    searchButtonIcon: {
        fontSize: 18,
    },
    errorText: {
        color: "#D32F2F",
        textAlign: "center",
        marginBottom: 16,
        fontSize: 18,
        fontWeight: "500",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
        paddingBottom: 80,
    },
    emptyIconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    emptyIcon: {
        fontSize: 38,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#3D3D4D",
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 13,
        color: "#A6A6B3",
        textAlign: "center",
        paddingHorizontal: 40,
        lineHeight: 19,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 18,
    },
    pokemonName: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1C1C28",
        textTransform: "capitalize",
    },
    pokemonId: {
        fontSize: 13,
        color: "#A6A6B3",
        marginTop: 2,
        fontWeight: "500",
    },
    typeBadge: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
    },
    typeBadgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.6,
    },
    imageBox: {
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        marginBottom: 18,
    },
    pokemonImage: {
        width: 150,
        height: 150,
    },
    descriptionBox: {
        borderTopWidth: 1,
        borderTopColor: "#F0F0F3",
        paddingTop: 16,
    },
    descriptionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: "#A6A6B3",
        letterSpacing: 1,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: "#3D3D4D",
        lineHeight: 21,
    },
});