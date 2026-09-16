import Pokemon from "../../interface/Pokemon";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface ShowPokemonProps {
    pokemon: Pokemon;
}

export default function ShowPokemon({ pokemon }: ShowPokemonProps) {
    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: pokemon.pokemon_image }}
                style={styles.image}
                contentFit="contain"
            />
            <Text style={styles.name}>{pokemon.pokemon_name}</Text>
            {pokemon.pokemon_id && (
                <Text style={styles.id}>#{pokemon.pokemon_id}</Text>
            )}

            {pokemon.types && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tipos</Text>
                    <Text>{pokemon.types.type1}</Text>
                    {pokemon.types.type2 && <Text>{pokemon.types.type2}</Text>}
                </View>
            )}

            {(pokemon.height || pokemon.weight) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Info</Text>
                    {pokemon.height && (
                        <Text>Altura: {pokemon.height / 10} m</Text>
                    )}
                    {pokemon.weight && (
                        <Text>Peso: {pokemon.weight / 10} kg</Text>
                    )}
                </View>
            )}

            {pokemon.stats && pokemon.stats.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Stats</Text>
                    {pokemon.stats.map((s) => (
                        <Text key={s.stat.name}>
                            {s.stat.name}: {s.base_stat}
                        </Text>
                    ))}
                </View>
            )}

            {pokemon.abilities && pokemon.abilities.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Habilidades</Text>
                    {pokemon.abilities.map((a) => (
                        <Text key={a.ability.name}>{a.ability.name}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: "center",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
    },
    id: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 16,
    },
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
});