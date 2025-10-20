import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
    title: string;
    leftComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, leftComponent, rightComponent }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={[styles.headerSide, styles.alignLeft]}>
                {leftComponent}
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={[styles.headerSide, styles.alignRight]}>
                {rightComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center', // Center the title by default
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 10, // Adjusted for consistency
        position: 'relative', // Ensure children can be positioned absolutely within
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 9,
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 8,
    },
    headerSide: {
        flex: 1,
    },
    alignLeft: {
        alignItems: 'flex-start',
    },
    alignRight: {
        alignItems: 'flex-end',
    },
    headerCenter: {
        flex: 2, // Give more space to the title to ensure it's centered
        alignItems: 'center',
    },
    headerTitle: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
    },
});