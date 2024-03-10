import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import SvgColor from 'src/components/svg-color';

const handleStyle = { left: 10 };

// function TextUpdaterNode({ data, isConnectable }) {
// const DefaultNode = ({ id, type, data, isConnectable }) => {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Top} isConnectable={isConnectable} id="t" />
//       <div>
//         <a href={data?.url} style={{color:"#000",textDecoration:"none"}}>
//         <label
//           style={{
//             border: '1px solid #1a192b',
//             backgroundColor: '#ffb34b',
//             padding: '10px',
//             width: '150px',
//             display: 'flex',
//             fontSize: '12px',
//           }}
//           htmlFor="text"
//         >
//           {` ${  data.label}`}
//           {/* ${id  } : */}
//         </label>
//         </a>
//         {/* <input id='text' name='text' onChange={onChange} className='nodrag' /> */}
//       </div>
//       <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
//     </div>
//   );
// };

// const TopTargetNode = ({ id, type, data, isConnectable }) => {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Top} isConnectable={isConnectable} id="t" />
//       <div>
//       <a href={data?.url} style={{color:"#000",textDecoration:"none"}}>
//         <label
//           style={{
//             border: '1px solid #1a192b',
//             backgroundColor: '#ffb34b',
//             padding: '10px',
//             width: '150px',
//             display: 'flex',
//             fontSize: '12px',
//           }}
//           htmlFor="text"
//         >
//           {` ${  data.label}`}
//           {/* ${id  } : */}
//         </label>
//         </a>
//         {/* <input id='text' name='text' onChange={onChange} className='nodrag' /> */}
//       </div>
//       <Handle
//         type="source"
//         position={Position.Left}
//         id="l"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="r"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
//     </div>
//   );
// };

// const TopLeftTargetNode = ({ id, type, data, isConnectable }) => {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Top} isConnectable={isConnectable} id="t" />
//       <div>
//       <a href={data?.url} style={{color:"#000",textDecoration:"none"}}>
//         <label
//           style={{
//             border: '1px solid #1a192b',
//             backgroundColor: '#ffb34b',
//             padding: '10px',
//             width: '150px',
//             display: 'flex',
//             fontSize: '12px',
//           }}
//           htmlFor="text"
//         >
//           {` ${  data.label}`}
//           {/* ${id  } : */}
//         </label>
//         </a>
//         {/* <input id='text' name='text' onChange={onChange} className='nodrag' /> */}
//       </div>
//       <Handle
//         type="target"
//         position={Position.Left}
//         id="l"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="r"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
//     </div>
//   );
// };

// const TopRightTargetNode = ({ id, type, data, isConnectable }) => {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Top} isConnectable={isConnectable} id="t" />
//       <div>
//       <a href={data?.url} style={{color:"#000",textDecoration:"none"}}>
//         <label
//           style={{
//             border: '1px solid #1a192b',
//             backgroundColor: '#ffb34b',
//             padding: '10px',
//             width: '150px',
//             display: 'flex',
//             fontSize: '12px',
//           }}
//           htmlFor="text"
//         >
//           {` ${  data.label}`}
//           {/* ${id  } : */}
//         </label>
//         </a>
//         {/* <input id='text' name='text' onChange={onChange} className='nodrag' /> */}
//       </div>
//       <Handle
//         type="source"
//         position={Position.Left}
//         id="l"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle
//         type="target"
//         position={Position.Right}
//         id="r"
//         // style={handleStyle}
//         isConnectable={isConnectable}
//       />
//       <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
//     </div>
//   );
// };

const MultiSrcAndTargetNode = (props) => {
  console.log('data',props);
  const { 
    id, type, data, isConnectable
  } = props;
	const onChange = useCallback((evt) => {
		console.log(evt.target.value);
	}, []);

	return (
		<div className='text-updater-node'>
			<Handle
				type='target'
				position={Position.Top}
				isConnectable={isConnectable}
				id='t'
			/>
			<div 
        style={{
          border: "1px solid #1a192b",
          backgroundColor: "#eee",
          padding: "0.3rem",
          width: "200px",
          display: "flex",
          fontSize: "11px",
          flexDirection: 'column'
        }}
      >
        <div>
				<p

        style={{
          margin:0
        }}
					
					htmlFor='text'
          // 
				>
					{data?.label}

          <a 
            className='nodrag'
            style={{
              textDecoration:'none',
            }}
            target="_blank"
            href={`${data?.url}`} 
            rel="noreferrer"
            >
            <SvgColor src='/assets/icons/app/ic_link.svg' sx={{ width: '1.1rem', height: '1.1rem',ml:1,p:1}} />
          </a>
          
          
				</p>
        </div>

        {data.organic_traffic && data.organic_traffic>0 ?
        <div
          style={{
            borderTop: "1px solid #1a192b",
            padding : '0.3rem',
            marginTop: '0.3rem'
          }}
          >
            {data?.keyword &&  <p style={{margin:0,fontSize:'10px'}}> Main Keyword : {data?.keyword} </p>}
            {data?.volume &&  <p style={{margin:0,fontSize:'10px'}}> Search volume : {data?.volume} </p>}
            {data?.difficulty &&  <p style={{margin:0,fontSize:'10px'}}> Difficulty : {data?.difficulty} </p>}
            {data?.backLink?.backLinks &&  <p style={{margin:0,fontSize:'10px'}}> BackLinks : {data?.backLink.backLinks} </p>}
            <p style={{margin:0,fontSize:'10px'}}> Organic Traffic : {data.organic_traffic} </p>
            {data?.search_position &&  <p style={{margin:0,fontSize:'10px'}}> Current position : {data?.search_position} </p>}
        </div>
        : null}

        
				 
			</div>

      
			<Handle
				type='source'
				position={Position.Left}
				id='l'
				// style={handleStyle}
				isConnectable={isConnectable}
			/>
			<Handle
				type='target'
				position={Position.Left}
				id='lt'
				style={{top:47}}
				isConnectable={isConnectable}
			/>
			<Handle
				type='target'
				position={Position.Right}
				id='r'
				isConnectable={isConnectable}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='rs'
				style={{top:47}}
				isConnectable={isConnectable}
			/>
			<Handle
				type='source'
				position={Position.Bottom}
				id='b'
				isConnectable={isConnectable}
			/>
		</div>
	);
};

const propType={
  id: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.object,
  isConnectable:PropTypes.bool,
  // organic_traffic: PropTypes.any,
  // keyword: PropTypes.any,
  // position: PropTypes.any,
  // backLink: PropTypes.any,
  // volume: PropTypes.any,
  // difficulty: PropTypes.any,
}

// TopTargetNode.propTypes = propType;
// TopRightTargetNode.propTypes = propType;
// TopLeftTargetNode.propTypes = propType;
// DefaultNode.propTypes = propType;
MultiSrcAndTargetNode.propTypes = propType;

const CustomNodes = {
  // TopTargetNode,
  // TopRightTargetNode,
  // TopLeftTargetNode,
  // DefaultNode,
  MultiSrcAndTargetNode
};

export default CustomNodes;
