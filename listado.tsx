import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FAB } from 'react-native-paper';

interface Beca {
    id: number;
    nombre_beneficiado: string;
    nombre_beca: string;
    monto: string;
}

function Listado() {
    const [becas, setBecas] = useState<Beca[]>([]);
    const [nuevaBeca, setNuevaBeca] = useState({
        nombre_beneficiado: '',
        nombre_beca: '',
        monto: '',
    });

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [becaSeleccionada, setBecaSeleccionada] = useState<Beca | null>(null);

    useEffect(() => {
        // Realizar la solicitud al servidor al montar el componente
        fetch('http://189.170.151.52:3000/api/becas')
            .then((response) => response.json())
            .then((data) => {
                // Almacenar los datos en el estado
                setBecas(data);
            })
            .catch((error) => {
                console.error('Error al obtener datos:', error);
            });
    }, []); // El segundo parámetro [] asegura que el efecto se ejecute solo una vez al montar el componente

    const agregarBeca = async () => {
        try {
            const response = await fetch('http://189.170.151.52:3000/api/becas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaBeca),
            });

            if (response.ok) {
                // Refrescar la lista después de agregar una nueva beca
                const nuevaListaBecas: Beca[] = await response.json();
                setBecas(nuevaListaBecas);

                // Limpiar los campos de la nueva beca
                setNuevaBeca({
                    nombre_beneficiado: '',
                    nombre_beca: '',
                    monto: '',
                });

                // Cerrar el formulario
                setMostrarFormulario(false);
            } else {
                Alert.alert('Error al agregar la beca');
            }
        } catch (error) {
            console.error('Error al agregar la beca:', error);
        }
    };

    const mostrarFormularioEdicion = (beca: Beca) => {
        setBecaSeleccionada(beca);
        setNuevaBeca({
            nombre_beneficiado: beca.nombre_beneficiado,
            nombre_beca: beca.nombre_beca,
            monto: beca.monto.toString(),
        });
        setMostrarFormulario(true);
    };

    const editarBeca = async () => {
        if (!becaSeleccionada) {
            return;
        }

        try {
            const response = await fetch(
                `http://189.170.151.52:3000/api/becas/${becaSeleccionada.id}`,
                {
                    method: 'PUT', // Cambiar al método HTTP correcto para editar
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevaBeca),
                }
            );

            if (response.ok) {
                // Refrescar la lista después de editar la beca
                const nuevaListaBecas: Beca[] = await response.json();
                setBecas(nuevaListaBecas);

                // Limpiar los campos y restablecer la beca seleccionada
                setNuevaBeca({
                    nombre_beneficiado: '',
                    nombre_beca: '',
                    monto: '',
                });
                setBecaSeleccionada(null);
                setMostrarFormulario(false);
            } else {
                Alert.alert('Error al editar la beca');
            }
        } catch (error) {
            console.error('Error al editar la beca:', error);
        }
    };

    const eliminarBeca = async (id: number) => {
        try {
          const response = await fetch(`http://189.170.151.52:3000/api/becas/${id}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            // Refrescar la lista después de eliminar la beca
            const nuevaListaBecas: Beca[] = await response.json();
            setBecas(nuevaListaBecas);
          } else {
            Alert.alert('Error al eliminar la beca');
          }
        } catch (error) {
          console.error('Error al eliminar la beca:', error);
        }
      };

    return (
        <View>
            <FlatList
        data={becas}
        style={{ paddingHorizontal: '10%' }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => mostrarFormularioEdicion(item)}>
            <View
              style={{
                borderColor: 'rgba(255, 255, 255, .7)',
                borderWidth: 1,
                marginVertical: 10,
                padding: 10,
              }}
            >
              <Text style={styles.label}>{`Beneficiado: ${item.nombre_beneficiado}`}</Text>
              <Text style={styles.label}>{`Beca: ${item.nombre_beca}`}</Text>
              <Text style={styles.label}>{`Monto: $${item.monto}.00`}</Text>

              {/* Nuevo botón para eliminar la beca */}
              <Button
                title="Eliminar"
                color="red"
                onPress={() => eliminarBeca(item.id)}
              />
            </View>
          </TouchableOpacity>
                )}
            />

            {/* Modal Formulario */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={mostrarFormulario}
                onRequestClose={() => {
                    setMostrarFormulario(!mostrarFormulario);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Formulario para agregar o editar una beca */}
                        <Text style={styles.modalHeaderText}>
                            {becaSeleccionada ? 'Editar Beca' : 'Nueva Beca'}
                        </Text>
                        <Text style={[styles.label, { color: '#000' }]}>Beneficiado</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Nombre del beneficiado"
                            value={nuevaBeca.nombre_beneficiado}
                            onChangeText={(text) =>
                                setNuevaBeca({ ...nuevaBeca, nombre_beneficiado: text })
                            }
                        />
                        <Text style={[styles.label, { color: '#000' }]}>Beca</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Nombre de la beca"
                            value={nuevaBeca.nombre_beca}
                            onChangeText={(text) => setNuevaBeca({ ...nuevaBeca, nombre_beca: text })}
                        />
                        <Text style={[styles.label, { color: '#000' }]}>Monto</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Monto"
                            value={nuevaBeca.monto}
                            onChangeText={(text) => setNuevaBeca({ ...nuevaBeca, monto: text })}
                        />
                        <View style={styles.botones}>
                            <Button
                                title={becaSeleccionada ? 'Guardar cambios' : 'Guardar'}
                                onPress={becaSeleccionada ? editarBeca : agregarBeca}
                            />
                            <Button
                                title="Cancelar"
                                color="red"
                                onPress={() => {
                                    setMostrarFormulario(false);
                                    setBecaSeleccionada(null);
                                    setNuevaBeca({
                                        nombre_beneficiado: '',
                                        nombre_beca: '',
                                        monto: '',
                                    });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Floating Action Button */}
            <FAB
                style={styles.fab}
                size='medium'
                icon="plus"
                onPress={() => setMostrarFormulario(true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        color: '#fefefe',
        fontFamily: 'Roboto-Regular',
        marginVertical: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro del modal
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalHeaderText: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .3)',
        borderRadius: 5,
        fontSize: 16,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Roboto-Thin',
    },
    botones: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default Listado;