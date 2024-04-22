import { Link, useLoaderData, useParams } from '@tanstack/react-router';
import React from 'react';
import LinkToDiagram from '~/components/LinkToDiagram';
import CreateURSDialog from '~/components/URS/CreateURSDialog';
import CreateCategoryStepDialog from '~/components/categorySteps/CreateCategoryStepDialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';

const StepPage = () => {
  const { projectId } = useParams({
    from: '/projects/$projectId/steps/$stepId',
  });
  const categoryStep = useLoaderData({
    from: '/projects/$projectId/steps/$stepId',
  });
  return (
    <>
      <header className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/projects/$projectId"
                  params={{
                    projectId: projectId,
                  }}
                >
                  Projet
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryStep.parents.map((parent) => (
              <React.Fragment key={parent.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/projects/$projectId/steps/$stepId"
                      params={{
                        projectId: projectId,
                        stepId: parent.id,
                      }}
                    >
                      {parent.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryStep.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LinkToDiagram projectId={projectId} />
      </header>
      <h1 className="font-bold text-2xl mt-4">{categoryStep.name}</h1>
      <section className="mt-4">
        <h2 className="text-xl flex items-center justify-between font-medium">
          <span>Process steps level {categoryStep.parents.length + 2}</span>
          <CreateCategoryStepDialog
            projectId={parseInt(projectId)}
            parentId={categoryStep.id}
          />
        </h2>
        <div className="grid grid-cols-5 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold mt-2">
          <div className="col-span-3">Nom</div>
        </div>
        {categoryStep.children.map((u) => (
          <Link
            key={u.id}
            to="/projects/$projectId/steps/$stepId"
            params={{
              projectId: projectId,
              stepId: u.id.toString(),
            }}
            className="grid grid-cols-5 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div className="col-span-3">{u.name}</div>
          </Link>
        ))}
      </section>
      <Separator className="my-6" />
      <section>
        <h2 className="text-xl flex items-center justify-between font-medium">
          <span>URS</span>
          <CreateURSDialog
            typeNeed="MACRO"
            categoryStepId={categoryStep.id}
            projectId={projectId}
          />
        </h2>
        <div className="grid grid-cols-5 bg-white rounded-lg px-4 py-2 text-[#284E91] font-semibold mt-2">
          <div>Code</div>
          <div className="col-span-3">Nom</div>
          <div>Statut</div>
        </div>
        {categoryStep.URS.map((u) => (
          <Link
            key={u.id}
            to="/projects/$projectId/urs/$id"
            params={{
              projectId: projectId,
              id: u.id.toString(),
            }}
            className="grid grid-cols-5 mt-2 px-4 py-2 bg-white rounded-lg"
          >
            <div>{u.code}</div>
            <div className="col-span-3">{u.name}</div>
            <div>{/*TODO URS Status */}</div>
          </Link>
        ))}
      </section>
    </>
  );
};

export default StepPage;
