import _ from 'lodash'
import fs from 'fs'
import path from 'path'

const threshold = 1; // Month
let saved = 0;
let counter = 0;
let searchCounter = 0;
const checkNodejs = (stats)=>{
	const {ctime , birthtime , mtime } = stats
	const d = new Date(mtime)
	const lapsed = new Date().getTime() - d.getTime()
	const months = lapsed / 1000 / 60 / 60 / 24 / 30 
	
	return months > 1
}

const deleteFolder = ({ folder ,stats})=>{
	console.log(" Deleting " , folder);
	saved += stats.size
	counter ++;
}

const cleanDirectory =  ({rootDirectory = ".", verbose = false})=>{
	searchCounter++;
	const folder = path.resolve(rootDirectory)
	if(verbose)
		console.log("Checking ",folder)

	_.map(fs.readdirSync(rootDirectory) , file=>{
		const stats = fs.lstatSync(path.join(folder,file))
		if(stats.isDirectory())
		{
			const current = path.join(folder , file)
			if(file === 'node_modules')
			{
				if(checkNodejs(stats))
					deleteFolder({
						stats , folder : current 
					})
				
			}
			else
				cleanDirectory({rootDirectory : current})
		}
	})
}

cleanDirectory({});
console.log("Searched",searchCounter," olders")
console.log("Saved "+counter+" folder",saved , saved/1000000.0 + "MB")