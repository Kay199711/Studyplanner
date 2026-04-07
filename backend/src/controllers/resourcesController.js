import prisma from '../config/database.js';

//GET, fetching all resources
export const getResources = async (req, res) => {
    try {
        const resources = await prisma.resources.findMany({
            orderBy: {className: "asc"}
        });

        const mapped = resources.map(r => ({
            resource_id: r.resourceID,
            class_name: r.className,
            description: r.description,
            instructor: r.instructor,
            schedule: r.schedule,
            semester: r.semester,
            created_at: r.createdAt,
            updated_at: r.updatedAt
        }));
        res.status(200).json(mapped);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

//POST, create new resource
export const createResource = async (req, res) => {
    const {class_name, description, instructor, schedule, semester} = req.body;

    if (!class_name) {
        return res.status(400).json({error: "please enter class name."});
    }
    
    try {
        const newResource = await prisma.resources.create({
            data: {
                className: class_name,
                description,
                instructor,
                schedule,
                semester
            }
        });

        const mapped = {
            resource_id: newResource.resourceID,
            class_name: newResource.className,
            description: newResource.description,
            instructor: newResource.instructor,
            schedule: newResource.schedule,
            semester: newResource.semester,
            created_at: newResource.createdAt,
            updated_at: newResource.updatedAt
        }
         res.status(201).json(mapped);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

//PUT, updating an existing resource
export const updateResource = async(req, res) => {
    const {id} = req.params;

    try {
        const existing = await prisma.resources.findUnique({
            where: {resourceID: (id)}
        });

        if (!existing) {
            return res.status(404).json({error: "given resourceID does not exist"});
        }
        const updated = await prisma.resources.update ({
            where: {resourceID: id},
            data: {
                className: req.body.class_name ?? existing.className,
                description: req.body.description ?? existing.description,
                instructor: req.body.instructor ?? existing.instructor,
                schedule: req.body.schedule ?? existing.schedule,
                semester: req.body.semester ?? existing.semester
            }
        });

        const mapped = {
            resource_id: updated.resourceID,
            class_name: updated.className,
            description: updated.description,
            instructor: updated.instructor,
            schedule: updated.schedule,
            semester: updated.semester,
            created_at: updated.createdAt,
            updated_at: updated.updatedAt
        }
         res.status(200).json(mapped);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

//DELETE, deleting a resource
export const deleteResource = async(req, res) => {
    const {id} = req.params;

    try {
        const existing = await prisma.resources.findUnique({
            where: {resourceID: id}
        });

        if (!existing) {
            return res.status(404).json({error: "given resourceID does not exist"});
        }

        await prisma.resources.delete({
            where: {resourceID: id}
        });

        res.status(200).json({message: "resource deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}