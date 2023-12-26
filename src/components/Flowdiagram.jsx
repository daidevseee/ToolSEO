import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge, applyNodeChanges
} from 'react-flow-renderer';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore"; 
import { db } from '../Service/firebase';

 
export default function Flowdiagram() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [editingNode, setEditingNode] = useState(null);

    // Khi component được mount, lắng nghe sự thay đổi từ Firestore
    useEffect(() => {
      const unsubscribeNodes = onSnapshot(collection(db, "nodes"), (snapshot) => {
        setNodes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      const unsubscribeEdges = onSnapshot(collection(db, "edges"), (snapshot) => {
        setEdges(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      return () => {
        unsubscribeNodes();
        unsubscribeEdges();
      };
    }, []);
    const addNewNodeToFirestore = async (newNode) => {
        const docRef = await addDoc(collection(db, "nodes"), newNode);
        // Lưu ID trả về từ Firestore vào nút để sau này có thể cập nhật hoặc xóa
        setNodes((nds) => nds.map((n) => (n.id === newNode.id ? { ...n, id: docRef.id } : n)));
      };
  
      // Thêm hàm xóa nút từ Firestore
      const removeNodeFromFirestore = async (nodeId) => {
        await deleteDoc(doc(db, "nodes", nodeId));
      };
  
      // Thêm hàm cập nhật nút trong Firestore
      const updateNodeInFirestore = async (nodeId, updatedData) => {
        const nodeRef = doc(db, "nodes", nodeId);
        // Cập nhật dữ liệu và vị trí của nút
        await updateDoc(nodeRef, {
          data: updatedData.data,
          position: updatedData.position
        });
      };
  
      // Ghi đè các hàm xử lý sự kiện để sử dụng các hàm Firestore
      const onConnect = useCallback(
        async (params) => {
          // Tạo cạnh mới
          const newEdge = addEdge(params, edges);
          // Lưu vào trạng thái cục bộ
          setEdges(newEdge);
          // Lưu vào Firestore
          await addDoc(collection(db, "edges"), {
            source: params.source,
            target: params.target,
            id: `${params.source}-${params.target}`,
          });
        },
        [edges, setEdges]
      );
      
      const handleNodesChange = useCallback(
        async (changes) => {
          for (const change of changes) {
            // Check if the change type is 'position' and if the position is defined
            if (change.type === 'position' && change.position) {
              const nodeRef = doc(db, "nodes", change.id);
              await updateDoc(nodeRef, {
                position: change.position
              });
            }
          }
          // Update node state
          setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setNodes]
      );
      
      
      
      const onNodeDoubleClick = useCallback((event, node) => {
        setEditingNode(node);
      }, []);
  
      const updateNode = useCallback((nodeData) => {
        const nodeToUpdate = nodes.find(n => n.id === nodeData.id);
        if (nodeToUpdate) {
          updateNodeInFirestore(nodeData.id, {
            data: nodeData.data,
            position: nodeToUpdate.position // Ensure the position is passed
          });
          setEditingNode(null);
        }
      }, [nodes]);
      
  
      const addNewNode = () => {
        const newNode = {
          position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
          data: { label: 'New Node' }
        };
        addNewNodeToFirestore(newNode);
      };
  
      const onNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();
        if (window.confirm(`Bạn có chắc chắn muốn xóa nút ${node.data.label} không?`)) {
          removeNodeFromFirestore(node.id);
        }
      }, []);
      // Hàm để xóa một nút và các cạnh liên quan
      const removeNode = (nodeId) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      };
      
      
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <div>
        <Link className='btn' to={'/'} >Thoát</Link>
        <button className='btn' onClick={addNewNode}>Add Node</button>

        </div>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange} // Sử dụng handleNodesChange ở đây
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeContextMenu={onNodeContextMenu}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
    {editingNode && <NodeEditForm node={editingNode} onSave={updateNode} />}
  </div>
  );
}
function NodeEditForm({ node, onSave }) {
    const [label, setLabel] = useState(node.data.label);
  
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: node.id, data: { label } });
      };
      
  
    return (
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className='class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"' type="submit">Save</button>
        </form>
      </div>
    );
  }
  